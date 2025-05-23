"use client"

import { Transition } from "@headlessui/react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import clx from "classnames"
import { type ReactNode, useLayoutEffect, useMemo, useState } from "react"
import Confetti from "react-confetti"
import { useMeasure } from "react-use"

import { FadeInOutTransition, Spotlight } from "@/components/atoms"
import { About, ErrorDisplay, Progress } from "@/components/molecules"
import { Result, WalletForm } from "@/components/templates"
import { useSolPrice, useTransactions } from "@/hooks"
import { type WalletResult } from "@/types"

const Providers = ({ children }: { children: ReactNode }) => {
	const walletEndpoint = useMemo(
		() => clusterApiUrl(WalletAdapterNetwork.Mainnet),
		[],
	)
	const wallets = useMemo(() => [new SolflareWalletAdapter()], [])

	return (
		<ConnectionProvider endpoint={walletEndpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}

const SolFeesApp = () => {
	const [address, setAddress] = useState<string | null>(null)
	const {
		addWallet: addAnotherWallet,
		error,
		progress,
		reset: resetResult,
		summary,
		state,
		wallets,
	} = useTransactions(address)
	const solPrice = useSolPrice()

	const addWallet = () => {
		addAnotherWallet()
		setAddress(null)
	}

	const reset = () => {
		resetResult()
		setAddress(null)
	}

	const [appReady, setAppReady] = useState(false)
	useLayoutEffect(() => {
		setAppReady(true)
	}, [])

	const [measureRef, { width: screenWidth, height: screenHeight }] =
		useMeasure<HTMLElement>()

	const [isElementLeaving, setIsElementLeaving] = useState(false)
	const setElementLeaving = () => setIsElementLeaving(true)
	const setElementNotLeaving = () => setIsElementLeaving(false)

	let spotlight1Size = screenWidth / 2
	let spotlight2Size = screenWidth / 3
	spotlight1Size = spotlight1Size > 400 ? 400 : spotlight1Size
	spotlight2Size = spotlight2Size > 200 ? 200 : spotlight2Size

	return (
		<Providers>
			<main
				ref={measureRef}
				className="min-h-screen flex flex-col items-center justify-center px-2"
			>
				<FadeInOutTransition
					show={
						(state === "intro" || state === "error") &&
						appReady &&
						!isElementLeaving
					}
					beforeLeave={setElementLeaving}
					afterLeave={setElementNotLeaving}
				>
					<ErrorDisplay error={error} />
					<WalletForm
						reset={reset}
						setAddress={setAddress}
						wallets={wallets.length}
					/>
				</FadeInOutTransition>
				<FadeInOutTransition
					show={
						(state === "loading" || state === "resolving") && !isElementLeaving
					}
					beforeLeave={setElementLeaving}
					afterLeave={setElementNotLeaving}
				>
					<Progress state={state} progress={progress} />
					<Spotlight opacity={0.1} size={spotlight1Size} />
					<Spotlight opacity={0.2} size={spotlight2Size} />
				</FadeInOutTransition>
				<Transition
					show={state === "done" && !isElementLeaving}
					afterEnter={() => window.scrollTo(0, 0)}
					beforeLeave={setElementLeaving}
					afterLeave={setElementNotLeaving}
					enter="transition-transform duration-200 ease-in"
					enterFrom="translate-y-full"
					enterTo="translate-y-0"
					leave="transition-transform duration-200 ease-out"
					leaveFrom="translate-y-0"
					leaveTo="translate-y-full"
					className={clx(
						"grow",
						"flex",
						"flex-col",
						"w-full",
						"sm:max-w-xl md:max-w-2xl lg:max-w-4xl",
						"mx-auto",
						"mt-2 sm:mt-4 md:mt-8",
						"pt-2 sm:pt-4 md:pt-8",
						"px-2 sm:px-4 md:px-8",
						"rounded-t-lg",
						"bg-white",
						"shadow-2xl",
					)}
				>
					<div className="grow">
						<Result
							addWallet={addWallet}
							reset={reset}
							summary={summary as WalletResult}
							wallets={wallets}
							solPrice={solPrice}
						/>
					</div>
					<About className="mt-12" />
				</Transition>
				{state === "done" ? (
					<Confetti
						gravity={0.5}
						height={screenHeight}
						numberOfPieces={200}
						recycle={false}
						run={state === "done"}
						width={screenWidth}
					/>
				) : null}
			</main>
		</Providers>
	)
}

export { SolFeesApp }
