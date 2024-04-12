import { useEffect, useRef, useState } from "react"

import { TX_CAP } from "@/constants"
import { isSolanaDomain } from "@/utils"
import { categorizyTransaction, mergeCategorizations } from "./categorization"
import {
	fetchAirdropEligibility,
	fetchDomainInfo,
	fetchTransactions,
} from "./api"
import {
	type AirdropEligibility,
	type HeliusParsedTransactionResponse,
	type HeliusParsedTransaction,
	type TransactionFetchingStatus,
	type WalletResult,
	type TransactionAggregation,
	type Categorization,
} from "@/types"

const E_TRY_AGAIN_BEFORE =
	/Failed to find events within the search period\. To continue search, query the API again with the `before` parameter set to (.*)\./

const fetchAllTransactions = async ({
	address,
	setProgress,
}: {
	address: string
	setProgress: Function
}) => {
	let includedSignatures = new Set()
	let before: string | null = null
	let result: Array<HeliusParsedTransaction> = []

	while (true) {
		const partial: HeliusParsedTransactionResponse = await fetchTransactions(
			address,
			before,
		)

		if ("error" in partial) {
			/* In very rare cases Helius might fails with a certain before parameter
				and provides an alternative to continue from. This can lead to
				duplicates */
			const tryAgainMatch: RegExpMatchArray | null =
				partial.error.match(E_TRY_AGAIN_BEFORE)
			if (tryAgainMatch && tryAgainMatch[1]) {
				before = tryAgainMatch[1]
				continue // Retry with new 'before'
			} else {
				// Fail on unknown error
				throw new Error(partial.error)
			}
		}

		// No more transactions, return
		if (!partial.length) return result

		before = partial[partial.length - 1].signature

		// Add new, non-duplicate transactions to result
		partial.forEach((newTx: HeliusParsedTransaction) => {
			if (!includedSignatures.has(newTx.signature)) {
				includedSignatures.add(newTx.signature)
				result.push(newTx)
			}
		})
		setProgress(result.length)

		// Stop and return if the cap is reached
		if (result.length >= TX_CAP) return result
	}
}

const aggregateTransactions = (
	address: string,
	transactions: Array<HeliusParsedTransaction>,
	prevResult: WalletResult | null = null,
) => {
	let aggregation: TransactionAggregation = {
		firstTransactionTS: Number.MAX_SAFE_INTEGER,
		failedTransactions: 0,
		feesAvg: 0,
		feesTotal: 0,
		transactionsCount: transactions.length,
		unpaidTransactionsCount: 0,
	}
	let categorizations: Categorization = {}

	transactions.map((tx) => {
		if (tx.feePayer === address) {
			aggregation.feesTotal += tx.fee
		} else {
			aggregation.unpaidTransactionsCount += 1
		}

		// Always zero, failed Txs are skipped by Helius parsed transactions API rn
		if (tx.transactionError !== null) aggregation.failedTransactions += 1

		aggregation.firstTransactionTS =
			tx.timestamp < aggregation.firstTransactionTS
				? tx.timestamp * 1000
				: aggregation.firstTransactionTS

		const category: string = categorizyTransaction(tx.type, tx.source)
		if (categorizations[category]) {
			categorizations[category].count += 1
			categorizations[category].fees += tx.fee
		} else {
			categorizations[category] = { count: 1, fees: tx.fee }
		}
	})
	aggregation.feesAvg =
		aggregation.transactionsCount !== 0
			? aggregation.feesTotal / aggregation.transactionsCount
			: 0

	if (prevResult && prevResult.aggregation) {
		aggregation.firstTransactionTS =
			prevResult.aggregation.firstTransactionTS < aggregation.firstTransactionTS
				? prevResult.aggregation.firstTransactionTS
				: aggregation.firstTransactionTS
		aggregation.failedTransactions += prevResult.aggregation.failedTransactions
		aggregation.feesAvg =
			(aggregation.feesAvg + prevResult.aggregation.feesAvg) / 2
		aggregation.feesTotal += prevResult.aggregation.feesTotal
		aggregation.transactionsCount += prevResult.aggregation.transactionsCount
		aggregation.unpaidTransactionsCount +=
			prevResult.aggregation.unpaidTransactionsCount

		categorizations = mergeCategorizations(
			categorizations,
			prevResult.categorizations || {},
		)
	}

	return { aggregation, categorizations }
}

function useTransactions(address: string | null) {
	const initialState: TransactionFetchingStatus = {
		error: null,
		isLoading: false,
		summary: null,
		state: "intro",
		transactions: null,
	}
	const [status, setStatus] = useState<TransactionFetchingStatus>(initialState)
	const setStateError = (error: Error | string) =>
		// Timeout prevents animations from overlapping
		setTimeout(
			() =>
				setStatus({
					error,
					isLoading: false,
					summary: null,
					state: "error",
					transactions: null,
				}),
			250,
		)
	const setStateLoading = () =>
		setStatus({
			error: null,
			isLoading: true,
			summary: null,
			state: "loading",
			transactions: null,
		})
	const setStateResolving = () =>
		setStatus({
			error: null,
			isLoading: true,
			summary: null,
			state: "resolving",
			transactions: null,
		})

	const cachedSummary = useRef<WalletResult | null>(null)
	const wallets = useRef<Array<string>>([])
	const [progress, setProgress] = useState(0)
	const reset = () => {
		cachedSummary.current = null
		wallets.current = []
		setStatus(initialState)
	}
	const addWallet = () => {
		cachedSummary.current = Object.assign({}, status.summary)
		setStatus({
			...initialState,
			summary: {
				...cachedSummary.current,
			},
		})
	}

	useEffect(() => {
		;(async () => {
			if (address === null) return

			let fullAddress = address
			if (isSolanaDomain(address)) {
				setStateResolving()
				let domainInfo: any
				try {
					domainInfo = await fetchDomainInfo(address)
				} catch (error) {
					setStateError(error as Error)
					return
				}
				if (domainInfo.error) {
					setStateError(new Error(domainInfo.error))
					return
				}
				fullAddress = domainInfo.address
			}

			setStateLoading()
			setProgress(0)

			let airdropEligibility: AirdropEligibility | null = null
			try {
				airdropEligibility = await fetchAirdropEligibility(fullAddress)
			} catch (error) {
				airdropEligibility = null
			}

			// If wallet transactions were already fetched, "return" them
			if (wallets.current.includes(fullAddress)) {
				setStatus((prev) => ({
					error: prev.error,
					isLoading: false,
					summary: {
						...cachedSummary.current,
						aggregation: prev.summary?.aggregation || null,
						airdropEligibility,
						categorizations: prev.summary?.categorizations || null,
					},
					state: "done",
					transactions: prev.transactions,
				}))
				return
			}

			// Timeout prevents animations from overlapping
			setTimeout(async () => {
				let transactions: HeliusParsedTransaction[] = []

				try {
					transactions = await fetchAllTransactions({
						address: fullAddress,
						setProgress,
					})
				} catch (error) {
					setStateError(error as Error)
				}

				wallets.current.push(fullAddress)
				setStatus({
					error: null,
					isLoading: false,
					summary: {
						airdropEligibility,
						...aggregateTransactions(
							fullAddress,
							transactions,
							cachedSummary.current,
						),
					},
					state: "done",
					transactions,
				})
			}, 250)
		})()
	}, [address])

	return { addWallet, progress, reset, ...status, wallets: wallets.current }
}

export { useTransactions }
