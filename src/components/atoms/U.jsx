import clx from "classnames"

const U = ({ as: Tag = "u", className, children, ...rest }) => (
	<Tag className={clx("underline underline-offset-4", className)} {...rest}>
		{children}
	</Tag>
)

export { U }
