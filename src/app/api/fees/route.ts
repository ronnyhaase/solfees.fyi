import { kv } from "@vercel/kv"
import BigNumber from "bignumber.js"
import { NextResponse } from "next/server"

async function fetchPrices() {
	const token = {
		bonk: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
		ether: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
		matic: "Gz7VkD4MacbEB6yC5XD3HcumEiYx2EtDYYrfikGsvopG",
		sol: "So11111111111111111111111111111111111111112",
	}

	const url =
		"https://public-api.birdeye.so/defi/multi_price?list_address=" +
		`${token.bonk},${token.ether},${token.matic},${token.sol}`

	return fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"X-API-Key": process.env.BIRDEYE_KEY || "",
			"X-Chain": "solana",
		},
	})
		.then((res) => res.json())
		.then((body) => ({
			bonk: new BigNumber(body.data[token.bonk].value)
				.decimalPlaces(9)
				.toNumber(),
			ethereum: new BigNumber(body.data[token.ether].value)
				.decimalPlaces(5)
				.toNumber(),
			polygon: new BigNumber(body.data[token.matic].value)
				.decimalPlaces(5)
				.toNumber(),
			solana: new BigNumber(body.data[token.sol].value)
				.decimalPlaces(5)
				.toNumber(),
		}))
}

async function GET() {
	let avgGasFees, avgTxGasUsage, prices
	try {
		;[avgGasFees, avgTxGasUsage, prices] = await Promise.all([
			kv.get("avg_gas_fees"),
			kv.get("avg_gas_usage"),
			fetchPrices(),
		])
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		)
	}

	const data = {
		avgGasFees,
		avgTxGasUsage,
		prices,
		symbols: {
			ethereum: "Ξ",
			polygon: "MATIC",
			solana: "◎",
		},
	}

	return NextResponse.json(data)
}

const maxDuration = 30
const revalidate = 900 // 15 minutes

export { GET, maxDuration, revalidate }
