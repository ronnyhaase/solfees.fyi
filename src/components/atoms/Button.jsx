import clx from "classnames"

const Button = ({
	className,
	children,
	color,
	full,
	size = "md",
	unstyled,
	...rest
}) => {
	const classNames = unstyled
		? []
		: [
				"inline-flex",
				"items-center",
				"justify-center",
				"rounded-lg",
				color === "primary" ? "bg-primary" : "bg-secondary",
				"leading-none",
				"text-white",
				"shadow-md",
				"active:enabled:scale-95 active:enabled:shadow-inner",
				"disabled:cursor-not-allowed disabled:opacity-90",
				{ "gap-x-2 px-4 py-3 text-base": size === "sm" },
				{ "gap-x-4 px-5 py-5": size === "md" },
		  ]
	classNames.push({ "w-full": full })

	return (
		<button className={clx(classNames, className)} type="button" {...rest}>
			{children}
		</button>
	)
}

export { Button }
