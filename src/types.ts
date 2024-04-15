type AirdropEligibilityItem = {
	protocol: string
	protocolLabel: string
	token: string
	ticker: string
	eligible: boolean
	amount: number
	note: string
	potentialValueUsdc: number
	error?: string | null
}

type AirdropEligibility = {
	address: string
	error: string | null
	eligibility: Array<AirdropEligibilityItem>
}

type AirdropEligibilityResponse = {
	data: Array<AirdropEligibility>
	error: string | null
}

type HeliusParsedTransaction = {
	fee: number
	feePayer: string
	signature: string
	source: string
	timestamp: number
	transactionError: string | null
	type: string
}

type HeliusParsedTransactionResponse =
	| Array<HeliusParsedTransaction>
	| { error: string }

type TransactionAggregation = {
	firstTransactionTS: number
	failedTransactions: number
	feesAvg: number
	feesTotal: number
	transactionsCount: number
	unpaidTransactionsCount: number
}

type Categorization = { [key: string]: { count: number; fees: number } }

type WalletResult = {
	aggregation: TransactionAggregation | null
	airdropEligibility: AirdropEligibility | null
	categorizations: Categorization | null
}

type WalletsSummary = Partial<WalletResult> & {
	firstTransaction: Date
	solFees: number
	solAvgFee: number
	usdFees: number
	usdAvgFee: number
	txCount: number
	txCountUnpaid: number
}

type TransactionFetchingStatusState =
	| "intro"
	| "error"
	| "loading"
	| "resolving"
	| "done"

type TransactionFetchingStatus = {
	error: Error | string | null
	isLoading: boolean
	summary: WalletResult | null
	state: TransactionFetchingStatusState
	transactions: Array<HeliusParsedTransaction> | null
}

type PricesAndFees = {
	avgGasFees: Record<string, number>
	avgTxGasUsage: Record<string, number>
	prices: Record<string, number>
	symbols: Record<string, string>
}

export {
	type AirdropEligibility,
	type AirdropEligibilityItem,
	type AirdropEligibilityResponse,
	type Categorization,
	type HeliusParsedTransaction,
	type HeliusParsedTransactionResponse,
	type PricesAndFees,
	type TransactionAggregation,
	type TransactionFetchingStatus,
	type TransactionFetchingStatusState,
	type WalletResult,
	type WalletsSummary,
}
