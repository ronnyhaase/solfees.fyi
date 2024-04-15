#!/usr/bin/env node

/**
 * A CLI tool fetching and printing an account's parsed transactions via Helius.
 */

import meow from "meow"

const isSolanaAddress = (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const fetchTransactions = async (apiKey, address, before) =>
	await fetch(
		`https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${apiKey}${
			before ? `&before=${before}` : ""
		}`,
	).then((r) => r.json())

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

	console.log("[")
	do {
		partial = await fetchTransactions(apiKey, address, before)
		before = partial.length ? partial[partial.length - 1].signature : null
		partial.map((tx) => console.log(JSON.stringify(tx) + ","))
	} while (partial.length)
	console.log("null]")

	process.exit(0)
})()
