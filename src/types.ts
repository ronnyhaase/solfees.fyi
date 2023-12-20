interface AirdropEligibilityItem {
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

interface AirdropEligibility {
	address: string
	error: string | null
	eligibility: Array<AirdropEligibilityItem>
}

interface AirdropEligibilityResponse {
	data: Array<AirdropEligibility>
	error: string | null
}

export {
	type AirdropEligibility,
	type AirdropEligibilityItem,
	type AirdropEligibilityResponse,
}
