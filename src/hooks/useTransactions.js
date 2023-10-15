import ky from 'ky'
import { useEffect, useRef, useState } from 'react'

import { TX_CAP } from '@/constants'
import { isSolanaDomain } from '@/utils'

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
const TIMEOUT = 0

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

const aggregateTransactions = (address, transactions, prevAggregation) => {
  let aggregation = {
    firstTransactionTS: Number.MAX_SAFE_INTEGER,
    failedTransactions: 0,
    feesAvg: 0,
    feesTotal: 0,
    transactionsCount: transactions.length,
    unpaidTransactionsCount: 0,
  }

  transactions.map((tx) => {
    if (tx.feePayer === address) {
      aggregation.feesTotal += tx.fee
    } else {
      aggregation.unpaidTransactionsCount += 1
    }

    // Always zero, failed Txs are skipped by Helius parsed transactions API rn
    if (tx.transactionError !== null) aggregation.failedTransactions += 1

    aggregation.firstTransactionTS = tx.timestamp < aggregation.firstTransactionTS
      ? tx.timestamp * 1000
      : aggregation.firstTransactionTS
  })
  aggregation.feesAvg = aggregation.transactionsCount !== 0
    ? aggregation.feesTotal / aggregation.transactionsCount
    : 0

  if (prevAggregation) {
    aggregation.firstTransactionTS =
      prevAggregation.firstTransactionTS < aggregation.firstTransactionTS
        ? prevAggregation.firstTransactionTS
        : aggregation.firstTransactionTS
    aggregation.failedTransactions += prevAggregation.failedTransactions
    aggregation.feesAvg = (aggregation.feesAvg + prevAggregation.feesAvg) / 2
    aggregation.feesTotal += prevAggregation.feesTotal
    aggregation.transactionsCount += prevAggregation.transactionsCount
    aggregation.unpaidTransactionsCount += prevAggregation.unpaidTransactionsCount
  }

  return aggregation
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
  const cachedSummary = useRef(null)
  const wallets = useRef([])
  const reset = () => {
    cachedSummary.current = null
    wallets.current = []
    setState(initialState)
  }
  const addWallet = () => {
    cachedSummary.current = state.summary
    setState({
      ...initialState,
      summary: cachedSummary.current
    })
  }

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    (async () => {
      if (address === null) return

      let fullAddress = address
      if (isSolanaDomain(address)) {
        setState({ error: null, isLoading: true, summary: null, state: 'resolving', transactions: null })
        let domainInfo
        try {
          domainInfo = await ky.get(
            `/api/domain/${address.toLowerCase()}`,
            { throwHttpErrors: false, timeout: 30000 },
          ).json()
        } catch (error) {
          setState({
            error,
            isLoading: false,
            summary: null,
            state: 'error',
            transactions: null,
          })
          return
        }
        if (domainInfo.error) {
          setTimeout(() => {
            setState({
              error: new Error(domainInfo.error),
              isLoading: false,
              summary: null,
              state: 'error',
              transactions: null,
            })
          }, 250)
          return
        }
        fullAddress = domainInfo.address
      }

      if (wallets.current.includes(fullAddress)) {
        setState((prev) => ({
          error: prev.error,
          isLoading: false,
          summary: prev.summary,
          state: 'done',
          transactions: prev.transactions,
        }))
        return
      }

      setState({ error: null, isLoading: true, summary: null, state: 'loading', transactions: null })
      setProgress(0)
      // Timeout prevents animations from overlapping
      setTimeout(() => {
        new Promise((resolve, reject) => next({ address: fullAddress, setProgress, resolve, reject }))
          .then((transactions) => {
            wallets.current.push(fullAddress)
            setState({
              error: null,
              isLoading: false,
              summary: aggregateTransactions(fullAddress, transactions, cachedSummary.current),
              state: 'done',
              transactions,
            })
          })
          .catch(error => setState({ error, isLoading: false, summary: null, state: 'error', transactions: null }))
      }, 250)
    })()
  }, [address])

  return { addWallet, progress, reset, ...state, wallets: wallets.current }
}

export {
  TX_CAP,
  useTransactions,
}
