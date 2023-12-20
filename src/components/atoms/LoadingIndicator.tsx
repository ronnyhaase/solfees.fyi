import clx from "classnames"

const LoadingIndicator: React.FC = () => {
	const sharedCircleClasses: clx.ArgumentArray = [
		"animate-zoom h-10 opacity-60 rounded-[50%] w-10",
	]

	return (
		<div className="h-10 w-10">
			<div className={clx(sharedCircleClasses, "bg-solana-green")} />
			<div
				className={clx(
					sharedCircleClasses,
					"animation-delay-750",
					"bg-solana-purple",
					"-mt-10",
				)}
			/>
		</div>
	)
}

export { LoadingIndicator }
