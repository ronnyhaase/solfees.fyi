import ky from "ky"

const fetchAirdropEligibility = (address) =>
	ky
		.get(`/api/airdrop/${address}`, {
			throwHttpErrors: false,
			timeout: 30000,
		})
		.json()

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

export { fetchAirdropEligibility, fetchDomainInfo, fetchTransactions }
