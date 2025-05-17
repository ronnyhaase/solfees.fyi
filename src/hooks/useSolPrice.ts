import { useCallback, useEffect, useRef, useState } from "react"

const useSolPrice = () => {
	const [solPrice, setSolPrice] = useState<number | null>(null)
	const [fetchFailed, setFetchFailed] = useState(false)
	const intervalRef = useRef<number | null>(null)

	const fetchSolPrice = useCallback(async (): Promise<void> => {
		if (solPrice) {
			setFetchFailed(false)
			return
		}

		try {
			const response = await fetch(
				"https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112",
			)
			if (!response.ok) {
				throw new Error("Failed to fetch SOL price")
			}
			const body = await response.json()
			setSolPrice(body.data.So11111111111111111111111111111111111111112.price)
			setFetchFailed(false)
		} catch (err) {
			console.error("Error fetching SOL price:", err)
			setFetchFailed(true)
		}
	}, [])

	useEffect(() => {
		fetchSolPrice()

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		// Start retry interval if price is null or fetch failed
		if ((solPrice === null || fetchFailed) && !intervalRef.current) {
			intervalRef.current = setInterval(fetchSolPrice, 1000)
		}
		// Clear retry interval once price is fetched successfully
		else if (solPrice !== null && intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}
	}, [solPrice, fetchFailed, fetchSolPrice])

	return solPrice
}

export { useSolPrice }
