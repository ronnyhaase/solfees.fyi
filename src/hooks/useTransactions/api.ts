import ky from "ky"

import {
	type HeliusParsedTransactionResponse,
	type AirdropEligibility,
} from "@/types"

const fetchAirdropEligibility = (
	address: string,
): Promise<AirdropEligibility> =>
	ky
		.get(`/api/airdrop/${address}`, {
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

const fetchDomainInfo = (domain: string) =>
	ky
		.get(`/api/domain/${domain.toLowerCase()}`, {
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

const fetchTransactions = (
	address: string,
	before: string | null,
): Promise<HeliusParsedTransactionResponse> =>
	ky
		.get(`/api/transactions/${address}`, {
			searchParams: before ? { before } : "",
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

export { fetchAirdropEligibility, fetchDomainInfo, fetchTransactions }
