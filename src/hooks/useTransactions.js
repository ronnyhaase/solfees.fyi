import ky from 'ky'
import { useEffect, useState } from 'react'

import { isSolanaDomain } from '@/utils'

const TIMEOUT = 0
const TX_CAP = 10000

const fetchTransactions = (address, before) => ky.get(
  `/api/transactions/${address}`,
  {
    searchParams: before ? { before } : '',
    throwHttpErrors: false,
  }
).json()

const next = async ({ address, before, result, resolve, reject, setProgress }) => {
  const partial = await fetchTransactions(address, before)
  if (partial.error) reject(new Error(partial.error))
  if (partial.length) {
    before = partial[partial.length - 1].signature
    result = (result || []).concat(partial)
    setProgress(result.length)
    if (result.length >= TX_CAP) resolve(result)
    else setTimeout(() => next({ address, before, result, resolve, setProgress }), TIMEOUT)
  } else {
    resolve(result)
  }
}

const aggregateTransactions = (address, transactions) => {
  let agg = {
    firstTransactionTS: Number.MAX_SAFE_INTEGER,
    failedTransactions: 0,
    feesAvg: 0,
    feesTotal: 0,
    transactionsCount: transactions.length,
    unpaidTransactionsCount: 0,
  }
  transactions.map((tx) => {
    if (tx.feePayer === address) {
      agg.feesTotal += tx.fee
    } else {
      agg.unpaidTransactionsCount += 1
    }

    // Always null, failed Txs are skipped by Helius parsed transactions API rn
    if (tx.transactionError !== null) agg.failedTransactions += 1

    agg.firstTransactionTS = tx.timestamp < agg.firstTransactionTS
      ? tx.timestamp * 1000
      : agg.firstTransactionTS
  })
  agg.feesAvg = agg.transactionsCount !== 0
    ? agg.feesTotal / agg.transactionsCount
    : 0
  return agg
}

function useTransactions(address) {
  const [state, setState] = useState({
    error: null,
    isLoading: false,
    summary: null,
    state: 'intro',
    transactions: null,
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    (async () => {
      if (address === null) return

      let fullAddress = address
      if (isSolanaDomain(address)) {
        setState({ error: null, isLoading: true, summary: null, state: 'resolving', transactions: null })
        const domainInfo = await ky.get(`/api/domain/${address.toLowerCase()}`, { throwHttpErrors: false }).json()
        if (domainInfo.error) {
          setState({
            error: new Error(domainInfo.error),
            isLoading: false,
            summary: null,
            state: 'error',
            transactions: null
          })
          return
        }
        fullAddress = domainInfo.address
      }

      setState({ error: null, isLoading: true, summary: null, state: 'loading', transactions: null })
      setProgress(0)
      // Timeout prevents animations from overlapping
      setTimeout(() => {
        new Promise((resolve, reject) => next({ address: fullAddress, setProgress, resolve, reject }))
          .then(transactions => setState({
            error: null,
            isLoading: false,
            summary: aggregateTransactions(fullAddress, transactions),
            state: 'done',
            transactions,
          }))
          .catch(error => setState({ error, isLoading: false, summary: null, state: 'error', transactions: null }))
      }, 250)
    })()
  }, [address])

  return { progress, ...state }
}

export {
  TX_CAP,
  useTransactions,
}
