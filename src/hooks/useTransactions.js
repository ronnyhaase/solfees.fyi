import ky from 'ky'
import { useEffect, useState } from 'react'

import { TX_CAP } from '@/constants'
import { isSolanaDomain } from '@/utils'

const TIMEOUT = 0

const fetchTransactions = (address, before) => ky.get(
  `/api/transactions/${address}`,
  {
    searchParams: before ? { before } : '',
    throwHttpErrors: false,
    timeout: 30000,
  }
).json()

const withNewTransactions = (target, includedSignatures, newTransactions) => {
  return (target || []).concat(
    newTransactions.filter((tx) => {
      if (!includedSignatures.has(tx.signature)) {
        includedSignatures.add(tx.signature)
        return true
      } else {
        return false
      }
    })
  )
}

const E_TRY_AGAIN_BEFORE = /Failed to find events within the search period\. To continue search, query the API again with the `before` parameter set to (.*)\./

const next = async ({ address, before, result, resolve, reject, setProgress, includedSignatures }) => {
  if (!includedSignatures) includedSignatures = new Set()

  const partial = await fetchTransactions(address, before)
  if (partial.error) {
    const tryAgainMatch = partial.error.match(E_TRY_AGAIN_BEFORE)
    if (tryAgainMatch && tryAgainMatch[1]) {
      before = tryAgainMatch[1]
      setTimeout(() => next({ address, before, result, resolve, reject, setProgress, includedSignatures }), TIMEOUT)
    } else {
      reject(new Error(partial.error))
    }
  } else if (partial.length) {
    before = partial[partial.length - 1].signature
    result = withNewTransactions(result, includedSignatures, partial)
    setProgress(result.length)
    if (result.length >= TX_CAP) resolve(result)
    else setTimeout(() => next({ address, before, result, resolve, reject, setProgress, includedSignatures }), TIMEOUT)
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

    // Always zero, failed Txs are skipped by Helius parsed transactions API rn
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
  const initialState = {
    error: null,
    isLoading: false,
    summary: null,
    state: 'intro',
    transactions: null,
  }
  const [state, setState] = useState(initialState)
  const reset = () => setState(initialState)
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
            transactions: null,
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

  return { progress, reset, ...state }
}

export {
  TX_CAP,
  useTransactions,
}
