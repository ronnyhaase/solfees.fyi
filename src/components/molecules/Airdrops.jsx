import { NumberDisplay, U } from "@/components/atoms"

function Airdrops({ data }) {
	console.log(data)
	if (!data) return null

	const count = data.eligibility.reduce(
		(acc, cur) => (acc + cur.eligible ? 1 : 0),
		0,
	)

	if (count === 0) {
		return (
			<h2 className="mb-2 text-center text-orange-500">
				Your wallet is not eligible for Airdrops. :(
			</h2>
		)
	}

	return (
		<div className="mb-4">
			<h2 className="mb-2 text-center text-orange-500">
				<U>Your wallet is eligible for Airdrops!</U>
			</h2>
			<table className="mx-auto">
				<thead>
					<tr>
						<th>Airdrop</th>
						<th>Eligible</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{data.eligibility.map((airdrop) => (
						<tr key={airdrop.protocol}>
							<td>{airdrop.protocolLabel}</td>
							<td className="_text-center">{airdrop.eligible ? "✅" : "❌"}</td>
							<td className="_text-right">
								${airdrop.ticker} <NumberDisplay val={airdrop.amount} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="my-4 text-center">
				<p className="text-base">
					Provided by SolWorks{" "}
					<a
						href="https://solana-airdrop-checker.solworks.dev/"
						target="_blank"
					>
						Solana Airdrop Checker
					</a>
					<br />
					Check wallets in bulk, get notifications and EVM support.
				</p>
				<p className="text-xs">All data without warranty</p>
			</div>
		</div>
	)
}

export { Airdrops }
