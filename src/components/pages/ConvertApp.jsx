"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useState } from "react"
import { FaXTwitter } from "react-icons/fa6"
import { RiArrowDownLine, RiArrowUpDownLine } from "react-icons/ri"

import { FadeInOutTransition } from "@/components/atoms"
import clx from "classnames"
import BigNumber from "bignumber.js"

const AVG_TX_FEE_USD = 0.00025

const Input = ({ className, ...rest }) => (
	<input
		className={clx("p-2", "border-2 border-secondary", "rounded-lg", className)}
		{...rest}
	/>
)

function ConvertApp() {
	const [appReady, setAppReady] = useState(false)
	useLayoutEffect(() => {
		setAppReady(true)
	}, [])

	const [usdValue, setUsdValue] = useState(850)
	const [txValue, setTxValue] = useState(
		new BigNumber(850).dividedToIntegerBy(AVG_TX_FEE_USD),
	)
	useEffect(() => {
		setTxValue(
			usdValue ? new BigNumber(usdValue).dividedToIntegerBy(AVG_TX_FEE_USD) : 0,
		)
	}, [usdValue])
	const [reason, setReason] = useState("")

	const generateTweet = () =>
		`I spent a total of ${txValue} Solana transactions${
			reason ? ` for ${reason}.` : "."
		}%0A%0A%23OnlyPossibleOnSolana%0A%0AFind out how much you would have spent at https://www.solfees.fyi/convert by %40solfees_fyi`

	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<FadeInOutTransition
				show={appReady}
				className="flex flex-col items-center justify-center gap-1 max-w-xs"
			>
				<label>USD</label>
				<Input
					value={usdValue}
					onChange={(ev) => setUsdValue(ev.target.value)}
					type="number"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
				/>
				<RiArrowUpDownLine className="text-primary" size={24} />
				<label>Solana Transactions</label>
				<Input readOnly value={txValue} />
				<RiArrowDownLine className="text-primary" size={24} />
				<label>For</label>
				<Input
					placeholder="Breakpoint Tickets"
					onChange={(ev) => setReason(ev.target.value)}
				/>
				<RiArrowDownLine className="text-primary" size={24} />
				<a
					className={clx(
						"inline-flex flex-row items-center justify-center",
						"w-full",
						"px-8 py-4",
						"rounded-full",
						"bg-[#000]",
						"text-lg",
						"text-white",
					)}
					href={`https://x.com/share?text=${generateTweet()}`}
					target="_blank"
					referrerPolicy="origin"
				>
					<FaXTwitter size={24} className="mr-2" />
					Post it
				</a>
				<RiArrowDownLine className="text-primary" size={24} />
				<Link href="/" className="mt-2 text-center">
					Check how much you&apos;ve spent on Solana transaction fees across all
					your wallets.
				</Link>
			</FadeInOutTransition>
		</main>
	)
}

export { ConvertApp }
