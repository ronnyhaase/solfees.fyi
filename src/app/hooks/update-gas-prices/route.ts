import { kv } from "@vercel/kv"
import BigNumber from "bignumber.js"
import { NextResponse } from "next/server"

import { GAS_DENOMINATOR } from "@/constants"

async function GET() {
	try {
		const query = `query GasPrices {
      ethereum { gasPrices { floor } }
      polygon { gasPrices { floor } }
    }`
		await fetch("https://api.quicknode.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": process.env.QUICKNODE_KEY || "",
			},
			body: JSON.stringify({ query }),
		})
			.then((res) => res.json())
			.then((body) => ({
				ethereum: new BigNumber(body.data.ethereum.gasPrices[0].floor)
					// Price returned in WEI
					.multipliedBy(GAS_DENOMINATOR)
					.decimalPlaces(5)
					.toNumber(),
				polygon: new BigNumber(body.data.polygon.gasPrices[0].floor)
					// Price returned in WEI
					.multipliedBy(GAS_DENOMINATOR)
					.decimalPlaces(5)
					.toNumber(),
			}))
			.then((data) => kv.set("avg_gas_fees", data))

		console.log("SUCCESS: Update gas prices")
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("FAILED: Update gas prices")
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		)
	}
}

export { GET }
