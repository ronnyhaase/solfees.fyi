import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

async function GET() {
	try {
		await fetch(
			`https://api.dune.com/api/v1/query/3082508/results?api_key=${process.env.DUNE_KEY}`,
		)
			.then((res) => res.json())
			.then((body) => body.result.rows[0])
			.then((data) => kv.set("avg_gas_usage", data))

		console.log("SUCCESS: Update average gas usage")
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("FAILED: Update average gas usage")
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		)
	}
}

export { GET }
