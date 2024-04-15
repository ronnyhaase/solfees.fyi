import BigNumber from "bignumber.js"
import { type ChangeEvent, useMemo, useState } from "react"
import Image from "next/image"

import { NoWrap, NumberDisplay, U } from "@/components/atoms"
import { GAS_DENOMINATOR } from "@/constants"
import { type PricesAndFees } from "@/types"
import { isFunction } from "@/utils"

const COMPARER_CHAINS = ["ethereum", "polygon"]
const VALIDATOR_MONTHLY_COSTS = 337

const Comparer: React.FC<{
	txCount: number
	pricesAndFees: PricesAndFees
	onChainChange: (ev: ChangeEvent<HTMLSelectElement>) => void
}> = ({ txCount, pricesAndFees, onChainChange }) => {
	const [chain, setChain] = useState(COMPARER_CHAINS[0])
	const data = useMemo(() => {
		const symbol = pricesAndFees.symbols[chain]
		const tokenCosts = new BigNumber(txCount)
			.multipliedBy(pricesAndFees.avgTxGasUsage[chain])
			.multipliedBy(pricesAndFees.avgGasFees[chain])
			.multipliedBy(GAS_DENOMINATOR)
			.decimalPlaces(5)
			.toNumber()
		const usdCosts = new BigNumber(tokenCosts)
			.multipliedBy(pricesAndFees.prices[chain])
			.decimalPlaces(2)
			.toNumber()
		const validatorRuntime =
			usdCosts > VALIDATOR_MONTHLY_COSTS
				? new BigNumber(usdCosts)
						.dividedBy(VALIDATOR_MONTHLY_COSTS)
						.integerValue()
						.toNumber()
				: null
		const bonk = new BigNumber(usdCosts)
			.dividedBy(pricesAndFees.prices.bonk)
			.integerValue()
			.toNumber()

		return { bonk, symbol, tokenCosts, usdCosts, validatorRuntime }
	}, [chain, pricesAndFees, txCount])

	const handleChainChange = (ev: ChangeEvent<HTMLSelectElement>) => {
		if (isFunction(onChainChange)) onChainChange(ev)
		setChain(ev.target.value)
	}

	return (
		<div className="my-4 px-2 py-4 rounded-lg bg-slate-100 text-center">
			On
			<select
				className="w-32 mx-2 border-2 border-primary rounded-lg bg-white text-center"
				value={chain}
				onChange={handleChainChange}
			>
				{COMPARER_CHAINS.map((chain) => (
					<option key={chain} value={chain}>
						{chain[0].toUpperCase() + chain.slice(1)}
					</option>
				))}
				<option disabled>More, soon!</option>
			</select>
			you would have paid approximately{" "}
			<NoWrap>
				{data.symbol} <NumberDisplay val={data.tokenCosts} />
			</NoWrap>{" "}
			or{" "}
			<NoWrap>
				$ <NumberDisplay val={data.usdCosts} />
			</NoWrap>{" "}
			for {txCount} transactions at the <U>current gas price</U>, assuming the{" "}
			<U>average gas usage</U> per transaction.
			<strong>
				{data.validatorRuntime ? (
					<>
						<br />
						You could run a Solana validator for ~{data.validatorRuntime} months
						from these fees,
						<br /> or buy <NumberDisplay val={data.bonk} /> BONK!
					</>
				) : (
					<>
						<br />
						You could buy <NumberDisplay val={data.bonk} /> BONK from these
						fees!
					</>
				)}
				<center>
					<Image alt="BONK!" height={32} src="/bonk.png" width={32} />
				</center>
			</strong>
		</div>
	)
}

export { Comparer }
