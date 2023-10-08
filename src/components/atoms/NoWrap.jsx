import clx from 'classnames'

const NoWrap = ({ as: Tag = 'span', className, children }) => (
  <Tag className={clx('whitespace-nowrap', className)}>{children}</Tag>
)

export {
  NoWrap,
}
