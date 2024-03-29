import { Categorization } from "@/types"
import { oneOf } from "@/utils"

const CATEGORIES: Record<string, string> = {
	BURN: "Burns",
	DEPLOYMENT: "Program Deployments",
	NFT_FI: "NFT Borrow / Lend",
	NFT_MINT: "NFT Mints",
	NFT_TRADING: "NFT Trading",
	NFT_TRANSFER: "NFT Transfers",
	STAKING: "Staking",
	SWAP_JUP: "Swaps (Jupiter)",
	SWAP_OTHERS: "Swaps (Others)",
	TOKEN_MINT: "Token Mints",
	TRANSFER: "Transfers",
	OTHER: "Others",
}

const CATEGORIZATIONS: Record<string, [string[], string[]]> = {
	// [type, source] - at least one of each, where empty means true
	BURN: [["BURN", "BURN_NFT"], []],
	DEPLOYMENT: [
		["FINALIZE_PROGRAM_INSTRUCTION", "UPGRADE_PROGRAM_INSTRUCTION"],
		[],
	],
	NFT_FI: [[], ["CITRUS", "SHARKY_FI"]],
	NFT_MINT: [["COMPRESSED_NFT_MINT", "NFT_MINT"], []],
	NFT_TRADING: [
		[
			"NFT_BID",
			"NFT_BID_CANCELLED",
			"NFT_CANCEL_LISTING",
			"NFT_GLOBAL_BID",
			"NFT_GLOBAL_BID_CANCELLED",
			"NFT_LISTING",
			"NFT_SALE",
		],
		[],
	],
	NFT_TRANSFER: [["COMPRESSED_NFT_TRANSFER"], []],
	STAKING: [
		["INIT_STAKE", "MERGE_STAKE", "SPLIT_STAKE", "STAKE_SOL", "UNSTAKE_SOL"],
		["STAKE_PROGRAM"],
	],
	SWAP_JUP: [["SWAP"], ["JUPITER"]],
	SWAP_OTHERS: [["SWAP"], ["ELIXIR", "FOXY", "ALDRIN", "HADESWAP"]],
	TOKEN_MINT: [["TOKEN_MINT"], []],
	TRANSFER: [["TRANSFER"], []],
}

const categorizyTransaction = (type: string, source: string) => {
	return (
		Object.keys(CATEGORIZATIONS).find(
			(key) =>
				oneOf(type, CATEGORIZATIONS[key][0]) &&
				oneOf(source, CATEGORIZATIONS[key][1]),
		) || "OTHER"
	)
}

function mergeCategorizations(...args: Array<Categorization>): Categorization {
	const result: Categorization = {}

	args.map((categorization) => {
		Object.keys(categorization).forEach((category) => {
			if (result[category]) {
				result[category].count += categorization[category].count
				result[category].fees += categorization[category].fees
			} else {
				result[category] = {
					count: categorization[category].count,
					fees: categorization[category].fees,
				}
			}
		})
	})

	return result
}

export { CATEGORIES, categorizyTransaction, mergeCategorizations }
