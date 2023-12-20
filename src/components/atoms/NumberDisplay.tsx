import { type ElementType } from "react"

const NumberDisplay: React.FC<{
	as?: ElementType
	className?: string
	val: number
}> = ({ as: Tag = "span", className, val }) => {
	const displayValue = new Intl.NumberFormat(navigator.language, {
		maximumFractionDigits: 9,
		minimumFractionDigits: 0,
		roundingPriority: "morePrecision",
	} as any).format(val)
	return <Tag className={className}>{displayValue}</Tag>
}

export { NumberDisplay }
