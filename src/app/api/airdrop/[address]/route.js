import { NextResponse } from "next/server"

import { isSolanaAddress } from "@/utils"

async function GET(_, { params: { address } }) {
	if (!isSolanaAddress(address)) {
		return NextResponse.json({ error: "Invalid address." }, { status: 400 })
	}

	const data = await fetch(
		`https://external.api.solworks.dev/v1/reports?addresses=${address}`,
		{
			method: "GET",
			headers: {
				"X-API-Key": process.env.AIRDROPCHECKER_KEY,
			},
		},
	)
		.then((r) => r.json())
		.then((body) => (Array.isArray(body.data) ? body.data[0] : null))

	return data
		? NextResponse.json(data)
		: NextResponse.json({ error: "Bad Gateway" }, { status: 502 })
}

const maxDuration = 30
const revalidate = 900 // 15 minutes

export { GET, maxDuration, revalidate }
