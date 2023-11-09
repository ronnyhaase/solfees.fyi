import BigNumber from "bignumber.js"
import { useMemo, useState } from "react"

import { NoWrap, U } from "@/components/atoms"
import { GAS_DENOMINATOR } from "@/constants"
import { isFunction } from "@/utils"

const COMPARER_CHAINS = ["ethereum", "polygon"]

const Comparer = ({ txCount, pricesAndFees, onChainChange }) => {
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

		return { symbol, tokenCosts, usdCosts }
	}, [chain, pricesAndFees, txCount])

	const handleChainChange = (ev) => {
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
				{data.symbol} {data.tokenCosts}
			</NoWrap>{" "}
			or <NoWrap>$ {data.usdCosts}</NoWrap> for {txCount} transactions at the{" "}
			<U>current gas price</U>, assuming the <U>average gas usage</U> per
			transaction.
		</div>
	)
}

export { Comparer }
