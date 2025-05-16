import { useEffect, useState } from "react"

const useSolPrice = () => {
	const [solPrice, setSolPrice] = useState<number | null>(null)

	useEffect(() => {
		const fetchSolPrice = async () => {
			try {
				const response = await fetch(
					"https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
				)
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const body = await response.json()
				setSolPrice(body.data.So11111111111111111111111111111111111111112.price)
			} catch (err) {
				setSolPrice(null)
			}
		}

		fetchSolPrice()
	}, [])

	return solPrice
}

export { useSolPrice }
