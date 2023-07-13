import { walletNameToAddressAndProfilePicture as fetchDomainInfo } from "@portal-payments/solana-wallet-names"
import { Connection } from "@solana/web3.js"
import { NextResponse } from "next/server"

import { isSolanaDomain } from "@/utils"

async function GET(request, { params: { domain } }) {
  if (!isSolanaDomain(domain)) {
    return NextResponse.json({ error: "Invalid domain." }, { status: 400 })
  }

  const connection = new Connection(
    `https://rpc.helius.xyz/?api-key=${process.env.API_KEY}`
  )
  const domainInfo = await fetchDomainInfo(connection, domain)

  if (!domainInfo.walletAddress) {
    return NextResponse.json({ error: "Domain not found." }, { status: 404 })
  }

  return NextResponse.json(domainInfo.walletAddress)
}

export { GET }
