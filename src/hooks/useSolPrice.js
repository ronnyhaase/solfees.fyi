import ky from 'ky'
import { useEffect, useState } from 'react'

function useSolPrice() {
  const [price, setPrice] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    ky.get('https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112')
      .json()
      .then(res => setPrice(res.data.value))
      .then(() => setIsLoading(false))
  }, [])

  return { price, isLoading }
}

export {
  useSolPrice,
}
