#!/usr/bin/env node

import meow from "meow"

const isSolanaAddress = (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const fetchTransactions = async (apiKey, address, before) => {
	const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${apiKey}${
		before ? `&before=${before}` : ""
	}`
	console.log(`>> ${url}`)
	return await fetch(url).then((r) => r.json())
}

;(async function main() {
	const args = meow(
		`
    Usage
      $ fetch-transactions <address>

    Options
      --apikey, -k   Helius API key
  `,
		{
			importMeta: import.meta,
			flags: {
				apikey: {
					isRequired: true,
					shortFlag: "k",
					type: "string",
				},
			},
		},
	)

	if (!isSolanaAddress(args.input.at(0))) {
		console.log("Invalid address")
		process.exit(1)
	}

	const apiKey = args.flags.apikey
	const address = args.input.at(0)

	let partial = []
	let before = null

	do {
		partial = await fetchTransactions(apiKey, address, before)
		before = partial.length ? partial[partial.length - 1].signature : null
		console.log(`Last TX sig: ${before}`)
	} while (partial.length)
	console.log("END (received [])\n")

	process.exit(0)
})()
