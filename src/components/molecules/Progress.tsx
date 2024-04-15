import { LoadingIndicator } from "@/components/atoms"
import { TransactionFetchingStatusState } from "@/types"

const Progress: React.FC<{
	progress: number
	state: TransactionFetchingStatusState
}> = ({ progress = 0, state }) => {
	const message =
		state === "resolving"
			? "Resolving domain."
			: `So far ${progress} transactions, and counting.`

	return (
		<div className="flex flex-col items-center text-center text-lg">
			<LoadingIndicator />
			<div>
				<strong className="block font-bold">
					Stay tuned, this may take a little while...
				</strong>
				<div className="text-center text-base">
					(~3 sec per 100 transactions)
				</div>
				{message}
			</div>
		</div>
	)
}

export { Progress }
