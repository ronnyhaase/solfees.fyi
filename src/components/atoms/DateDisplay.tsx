import { type ElementType } from "react"

const DateDisplay: React.FC<{
	as?: ElementType
	className?: string
	val: Date
}> = ({ as: Tag = "span", className, val }) => {
	const displayValue = new Intl.DateTimeFormat(navigator.language, {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		weekday: "long",
	}).format(val)
	return <Tag className={className}>{displayValue}</Tag>
}

export { DateDisplay }
