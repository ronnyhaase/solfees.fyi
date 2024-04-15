import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"

import { Button } from "@/components/atoms"

const ErrorDisplay: React.FC<{
	error: Error | string | null | undefined
}> = ({ error }) => {
	const [closed, setClosed] = useState(false)
	useEffect(() => {
		setClosed(false)
	}, [error])

	return error && !closed ? (
		<div className="max-w-md mb-4 p-4 rounded-lg drop-shadow-lg bg-red-400 text-white">
			<div className="flex items-stretch text-2xl">
				<span className="grow">Oops...</span>
				<Button unstyled onClick={() => setClosed(true)}>
					<IoClose />
				</Button>
			</div>
			<p className="break-words">
				{error instanceof Error ? (error as Error).message : error}.
			</p>
		</div>
	) : null
}

export { ErrorDisplay }
