import clx from 'classnames'
import { useEffect, useState } from 'react'

import { SOL_PER_LAMPORT, TX_CAP } from '@/constants'
import { Button } from '@/components/atoms'
import { IoRepeatSharp } from 'react-icons/io5'

const generateTweetMessage = (fees, transactions) =>
  `I spent only $${fees} in fees for all of my ${transactions} Solana transaction, at the current SOL price!%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi by %40ronnyhaase !`

const Result = ({ className, reset, summary, solPrice }) => {
  const [cachedSummary, setCachedSummary] = useState(null)
  useEffect(() => {
    setCachedSummary(summary ? summary : cachedSummary)
  }, [cachedSummary, summary])

  const firstTransaction = cachedSummary
    ? new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      })
        .format(new Date(cachedSummary.firstTransactionTS))
    : null
  const solFees = cachedSummary ? (cachedSummary.feesTotal * SOL_PER_LAMPORT).toFixed(5) : 0
  const txCount = cachedSummary ? cachedSummary.transactionsCount : 0
  const txCountUnpaid = cachedSummary ? cachedSummary.unpaidTransactionsCount : 0
  const usdFees = cachedSummary && solPrice ? (cachedSummary.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2) : 0
  const solAvgFee = cachedSummary ? (cachedSummary.feesAvg * SOL_PER_LAMPORT).toFixed(6) : 0
  const usdAvgFee = cachedSummary && solPrice ? (cachedSummary.feesAvg * SOL_PER_LAMPORT * solPrice).toFixed(6) : 0

  const tweetMessage = generateTweetMessage(usdFees, txCount)

  return (
    <div className={className}>
      <p>
        This account has spent{' '}
        <span className="text-solana-purple">
          ◎ {solFees}{' '}
        </span>
        in fees for{' '}
        <span className="text-solana-purple">{txCount} transactions</span>.
        {txCount >= TX_CAP ? (
          <span className="block text-blue-500 text-sm">
            ℹ︎ We&apos;re currently stopping at {TX_CAP} transactions, sorry!
          </span>
        ) : null}
      </p>
      <p>
        <u className="underline underline-offset-4">Right now</u>, that&apos;s{' '}
        <span className="text-solana-purple">
          {solPrice ? (
            <>$ {usdFees}</>
          ) : (
            <><span>¯\_(ツ)_/¯</span> $</>
          )}
        </span>
        .
      </p>
      <div className="mt-2 text-lg">
        <p>The account paid for {txCount - txCountUnpaid} of the {txCount} transactions. On average,
        it paid <span className="whitespace-nowrap">◎ {solAvgFee} ($ {usdAvgFee})</span> per transaction.</p>
        <p>The very first transaction was sent on {firstTransaction}</p>
      </div>
      <div className="mt-2 text-center">
        <Button color="primary" size="sm" onClick={reset}>
          <IoRepeatSharp size={20} />
          Check another wallet
        </Button>
      </div>
      <p
        className={clx(
          "drop-shadow-lg",
          "font-bold",
          "from-solana-purple",
          "bg-clip-text",
          "bg-gradient-to-tr",
          "my-12",
          "text-6xl",
          "text-center",
          "text-transparent",
          "tracking-tight",
          "to-solana-green",
        )}
      >
        OPOS
      </p>
      <p className="text-center">
        <a
          className={clx(
            'block sm:inline-flex',
            "bg-[#0C9DED]",
            "px-8",
            "py-4",
            "rounded-full",
            "text-lg",
            "text-white",
          )}
          href={`https://twitter.com/share?text=${tweetMessage}`}
        >Tweet it</a>
      </p>
    </div>
  )
}

export {
  Result,
}
