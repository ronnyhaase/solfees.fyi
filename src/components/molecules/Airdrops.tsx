import { NumberDisplay, U } from "@/components/atoms"
import { type AirdropEligibility, type AirdropEligibilityItem } from "@/types"

const Airdrops: React.FC<{ data: AirdropEligibility }> = ({ data }) => {
	if (!data) return null

	const count = data.eligibility.reduce(
		(acc, cur) => acc + (cur.eligible ? 1 : 0),
		0,
	)

	if (count === 0) {
		return (
			<h2 className="mb-2 text-center text-orange-500">
				Your wallet is not eligible for Airdrops. :(
			</h2>
		)
	}

	const renderEligible = (airdrop: AirdropEligibilityItem) => {
		if (airdrop.eligible && airdrop.amount) return "✅"
		else if (!airdrop.eligible && !airdrop.error) return "❌"
		// This combination occurs when SAC API limit was hit
		else if (!airdrop.eligible && !airdrop.amount && airdrop.error) return "N/A"
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
					{data.eligibility.map((airdrop: AirdropEligibilityItem) => (
						<tr key={airdrop.protocol}>
							<td>{airdrop.protocolLabel}</td>
							<td>{renderEligible(airdrop)}</td>
							<td>
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
						href="https://airdropped.link/r/rudely-sheep-whimpered-19"
						target="_blank"
					>
						Airdrop Checker
					</a>
				</p>
				<p className="text-xs">All data without warranty</p>
			</div>
		</div>
	)
}

export { Airdrops }
