import clx from 'classnames'

const Button = ({ className, children, color, full, unstyled, ...rest }) => {
  const classNames = unstyled ? [] : [
    'flex',
    'gap-x-4',
    'items-center',
    'justify-center',
    'px-5',
    'py-5',
    'rounded-lg',
    color === 'primary' ? 'bg-primary' : 'bg-secondary',
    'leading-none',
    'text-white',
    'shadow-md',
    'active:enabled:scale-95 active:enabled:shadow-inner',
    'disabled:cursor-not-allowed disabled:opacity-90',
  ]
  classNames.push({ 'w-full': full })

  return (
    <button
      className={clx(classNames, className)}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}

export {
  Button,
}
