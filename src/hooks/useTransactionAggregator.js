import { useEffect, useState } from 'react'

function useTransactionAggregator(address, transactions) {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!address) return
    else if (!transactions) {
      setSummary(null)
      return
    }

    let agg = { transactionsCount: transactions.length, feesAvg: 0, feesTotal: 0 }
    transactions.map((tx) => {
      if (tx.feePayer === address) {
        agg.feesTotal += tx.fee
      }
    })
    agg.feesAvg = agg.transactionsCount !== 0
      ? agg.feesTotal / agg.transactionsCount
      : 0
    setSummary(agg)
  }, [address, transactions])

  return summary
}

export {
  useTransactionAggregator,
}
