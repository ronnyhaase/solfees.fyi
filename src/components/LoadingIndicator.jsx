import classNames from 'classnames'

const LoadingIndicator = ({ progress = 0, state }) => {
  const sharedCircleClasses = ["animate-zoom h-10 opacity-60 rounded-[50%] w-10"]
  const message = state === 'resolving'
    ? 'Resolving domain.'
    : `So far ${progress} transactions, and counting.`

  return (
    <div className="flex flex-col items-center text-center text-lg">
      <div className="h-10 w-10">
          <div
            className={classNames(sharedCircleClasses, "bg-solana-green" )}
          />
          <div
            className={classNames(
              sharedCircleClasses,
              "animation-delay-750",
              "bg-solana-purple",
              "-mt-10",
            )}
          />
      </div>
      <div>
        <strong className="block font-bold">
          Stay tuned, this may takes a little while...
        </strong>
        {message}
      </div>
    </div>
  )
}

export {
  LoadingIndicator,
}
