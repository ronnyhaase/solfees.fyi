import { NextResponse } from "next/server"

import { isSolanaAddress } from "@/utils"
import {
	type AirdropEligibility,
	type AirdropEligibilityResponse,
} from "@/types"

async function GET(
	_: unknown,
	{ params: { address } }: { params: { address: string } },
) {
	if (!isSolanaAddress(address)) {
		return NextResponse.json({ error: "Invalid address" }, { status: 400 })
	}

	let data: AirdropEligibility | null
	try {
		data = await fetch(
			`https://external.api.solworks.dev/v1/reports?addresses=${address}`,
			{
				method: "GET",
				headers: {
					"X-API-Key": process.env.AIRDROPCHECKER_KEY || "",
				},
			},
		)
			.then((r) => r.json())
			.then((body: AirdropEligibilityResponse) =>
				Array.isArray(body.data) ? body.data[0] : null,
			)
	} catch (error) {
		return NextResponse.json(
			{ error: "Unknown error with airdrop API" },
			{ status: 502 },
		)
	}

	return data
		? NextResponse.json(data)
		: NextResponse.json(
				{ error: "Unknown error with airdrop API" },
				{ status: 502 },
			)
}

const maxDuration = 30
const revalidate = 900 // 15 minutes

export { GET, maxDuration, revalidate }
