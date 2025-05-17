import { resolve as resolveSolDomain } from "@bonfida/spl-name-service"
// import { TldParser } from "@onsol/tldparser"
import { Connection } from "@solana/web3.js"
import { NextResponse } from "next/server"

import { isSolanaDomain } from "@/utils"

async function GET(
	_: unknown,
	{ params }: { params: Promise<{ domain: string }> },
) {
	const { domain } = await params

	if (!isSolanaDomain(domain)) {
		return NextResponse.json({ error: "Invalid domain" }, { status: 400 })
	}

	const connection = new Connection(
		`https://rpc.helius.xyz/?api-key=${process.env.HELIUS_KEY}`,
	)
	let address: string
	try {
		const [, tld] = domain.split(".")
		if (tld === "sol") {
			address = (await resolveSolDomain(connection, domain)).toString()
		} else {
			// Currently breaking for unknown reasons
			/*
			const parser = new TldParser(connection)
			address = (await parser.getOwnerFromDomainTld(domain))?.toString() || ""
			*/
			return NextResponse.json(
				{ error: "Resolving AllDomains is temporarily disabled. Sorry" },
				{ status: 502 },
			)
		}
	} catch (error) {
		console.error("Error resolving domain:", error)
		return NextResponse.json(
			{ error: "Unknown error with domain service" },
			{ status: 502 },
		)
	}

	if (!address) {
		return NextResponse.json({ error: "Domain not found" }, { status: 404 })
	}

	return NextResponse.json({ address })
}

const maxDuration = 30
const revalidate = 900 // 15 minutes

export { GET, maxDuration, revalidate }
