import { NextResponse } from "next/server"

import { isSolanaAddress } from "@/utils"

async function GET(request, { params: { address } }) {
	if (!isSolanaAddress(address)) {
		return NextResponse.json({ error: "Invalid address." }, { status: 400 })
	}

	const account = await fetch(
		`https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: 123,
				method: "getAccountInfo",
				params: [address],
			}),
		},
	)
		.then((resp) => resp.json())
		.then((data) => data?.result?.value)
	if (!account || !account.owner) {
		return NextResponse.json(
			{ error: "Account not found or not funded." },
			{ status: 404 },
		)
	}
	if (account.owner !== "11111111111111111111111111111111") {
		return NextResponse.json(
			{ error: "PDA accounts are not allowed." },
			{ status: 400 },
		)
	}

	const before = request.nextUrl.searchParams.get("before")
	const data = await fetch(
		`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${
			process.env.HELIUS_KEY
		}${before ? `&before=${before}` : ""}`,
	).then((r) => r.json())

	return NextResponse.json(data)
}

const maxDuration = 30

export { GET, maxDuration }
