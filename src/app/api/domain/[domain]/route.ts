import { walletNameToAddressAndProfilePicture as fetchDomainInfo } from "@portal-payments/solana-wallet-names"
import { Connection } from "@solana/web3.js"
import { NextResponse } from "next/server"

import { isSolanaDomain } from "@/utils"

async function GET(
	_: unknown,
	{ params: { domain } }: { params: { domain: string } },
) {
	if (!isSolanaDomain(domain)) {
		return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
	}

	const connection = new Connection(
		`https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`,
	)
	let domainInfo
	try {
		domainInfo = await fetchDomainInfo(connection, domain)
	} catch (error) {
		return NextResponse.json(
			{ error: "Unknown error with domain service" },
			{ status: 502 },
		)
	}

	if (!domainInfo.walletAddress) {
		return NextResponse.json({ error: "Domain not found" }, { status: 404 })
	}

	return NextResponse.json({ address: domainInfo.walletAddress })
}

const maxDuration = 30
const revalidate = 900 // 15 minutes

export { GET, maxDuration, revalidate }
