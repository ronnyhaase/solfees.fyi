import ky from 'ky'
import { useEffect, useState } from 'react'

const TIMEOUT = 0
const TX_CAP = 10000

const fetchTransactions = (address, before) => ky.get(
  `/api/${address}`,
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

function useTransactions(address) {
  const [transactions, setTransactions] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (address === null) return

    if (address !== null) {
      setIsLoading(true)
      setProgress(0)
      setError(false)
    }
    new Promise((resolve, reject) => next({ address, setProgress, resolve, reject }))
      .then(setTransactions)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [address])

  return { transactions, isLoading, progress, error }
}

export {
  useTransactions,
}
