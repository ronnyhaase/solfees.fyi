import clx from "classnames"
import { type ElementType, type ReactNode } from "react"

const NoWrap: React.FC<{
	as?: ElementType
	children: ReactNode
	className?: string
}> = ({ as: Tag = "span", className, children }) => (
	<Tag className={clx("whitespace-nowrap", className)}>{children}</Tag>
)

export { NoWrap }
