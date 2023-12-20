import clx from "classnames"
import { type ElementType, type ReactNode } from "react"

const U: React.FC<{
	as?: ElementType
	className?: string
	children: ReactNode
}> = ({ as: Tag = "u", className, children, ...rest }) => (
	<Tag className={clx("underline underline-offset-4", className)} {...rest}>
		{children}
	</Tag>
)

export { U }
