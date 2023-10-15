import ky from 'ky'
import { useEffect, useState } from 'react'

function usePricesAndFees() {
  const [pricesAndFees, setPricesAndFees] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    ky.get('api/fees', {
      prefixUrl: new URL(document.baseURI).origin,
      timeout: 30000,
    })
      .json()
      .then(body => setPricesAndFees(body))
      .then(() => setIsLoading(false))
      .catch(() => setPricesAndFees(null))
  }, [])

  return { pricesAndFees, isLoading }
}

export {
  usePricesAndFees,
}
