import ky from "ky"
import { useEffect, useRef, useState } from "react"

import { TX_CAP } from "@/constants"
import { isSolanaDomain } from "@/utils"
import {
	categorizyTransaction,
	mergeCategorizations,
} from "./useTransactions/categorization"

const fetchDomainInfo = (domain) =>
	ky
		.get(`/api/domain/${domain.toLowerCase()}`, {
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

const fetchTransactions = (address, before) =>
	ky
		.get(`/api/transactions/${address}`, {
			searchParams: before ? { before } : "",
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

const E_TRY_AGAIN_BEFORE =
	/Failed to find events within the search period\. To continue search, query the API again with the `before` parameter set to (.*)\./

const fetchAllTransactions = async ({ address, setProgress }) => {
	let includedSignatures = new Set()
	let before = null
	let result = []

	while (true) {
		const partial = await fetchTransactions(address, before)

		if (partial.error) {
			/* In very rare cases Helius might fails with a certain before parameter
				and provides an alternative to continue from. This can lead to
				duplicates */
			const tryAgainMatch = partial.error.match(E_TRY_AGAIN_BEFORE)
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
		partial.forEach((newTx) => {
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

const aggregateTransactions = (address, transactions, prevResult) => {
	let aggregation = {
		firstTransactionTS: Number.MAX_SAFE_INTEGER,
		failedTransactions: 0,
		feesAvg: 0,
		feesTotal: 0,
		transactionsCount: transactions.length,
		unpaidTransactionsCount: 0,
	}
	let categorizations = {}

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

		const category = categorizyTransaction(tx.type, tx.source)
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

	if (prevResult) {
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
			prevResult.categorizations,
		)
	}

	return { aggregation, categorizations }
}

function useTransactions(address) {
	const initialState = {
		error: null,
		isLoading: false,
		summary: null,
		state: "intro",
		transactions: null,
	}
	const [state, setState] = useState(initialState)
	const setStateError = (error) =>
		// Timeout prevents animations from overlapping
		setTimeout(
			() =>
				setState({
					error,
					isLoading: false,
					summary: null,
					state: "error",
					transactions: null,
				}),
			250,
		)
	const setStateLoading = () =>
		setState({
			error: null,
			isLoading: true,
			summary: null,
			state: "loading",
			transactions: null,
		})
	const setStateResolving = () =>
		setState({
			error: null,
			isLoading: true,
			summary: null,
			state: "resolving",
			transactions: null,
		})

	const cachedSummary = useRef(null)
	const wallets = useRef([])
	const [progress, setProgress] = useState(0)
	const reset = () => {
		cachedSummary.current = null
		wallets.current = []
		setState(initialState)
	}
	const addWallet = () => {
		cachedSummary.current = { ...state.summary }
		setState({
			...initialState,
			summary: { ...cachedSummary.current },
		})
	}

	useEffect(() => {
		;(async () => {
			if (address === null) return

			let fullAddress = address
			if (isSolanaDomain(address)) {
				setStateResolving()
				let domainInfo
				try {
					domainInfo = await fetchDomainInfo(address)
				} catch (error) {
					setStateError(error)
					return
				}
				if (domainInfo.error) {
					setStateError(new Error(domainInfo.error))
					return
				}
				fullAddress = domainInfo.address
			}

			// If wallet transactions are already fetched, "return" them
			if (wallets.current.includes(fullAddress)) {
				setState((prev) => ({
					error: prev.error,
					isLoading: false,
					summary: cachedSummary.current,
					state: "done",
					transactions: prev.transactions,
				}))
				return
			}

			setStateLoading()
			setProgress(0)
			// Timeout prevents animations from overlapping
			setTimeout(async () => {
				let transactions = null

				try {
					transactions = await fetchAllTransactions({
						address: fullAddress,
						setProgress,
					})
				} catch (error) {
					setStateError(error)
				}

				wallets.current.push(fullAddress)
				setState({
					error: null,
					isLoading: false,
					summary: aggregateTransactions(
						fullAddress,
						transactions,
						cachedSummary.current,
					),
					state: "done",
					transactions,
				})
			}, 250)
		})()
	}, [address])

	return { addWallet, progress, reset, ...state, wallets: wallets.current }
}

export { useTransactions }
