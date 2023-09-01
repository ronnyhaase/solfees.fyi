import { SOL_PER_LAMPORT, TX_CAP } from '@/constants'
import classNames from 'classnames'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const generateTweetMessage = (fees, transactions) =>
  `I spent only $${fees} in fees for all of my ${transactions} Solana transaction, at the current SOL price!%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi%3Fxyz by %40ronnyhaase !`

const Result = ({ summary, solPrice }) => {
  const [cachedSummary, setCachedSummary] = useState(null)
  useEffect(() => {
    setCachedSummary(summary ? summary : cachedSummary)
  }, [summary])

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
    <>
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
      <p
        className={classNames(
          "drop-shadow-lg",
          "font-bold",
          "from-solana-purple",
          "bg-clip-text",
          "bg-gradient-to-br",
          "my-12",
          "text-6xl",
          "text-center",
          "text-transparent",
          "to-solana-green",
        )}
      >
        OPOS
      </p>
      <p className="text-center">
        <a
          className={classNames(
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
      <a
        className="block max-w-xs mx-auto mt-12 text-center text-base text-[#145D3E]"
        href="https://app.sunrisestake.com"
      >
        If you like this tool, thank me by offsetting emissions while you sleep.<br />
        <Image
          alt="Sunrise Stake - Offset emissions while you sleep."
          className="inline max-w-[128px]"
          height={61}
          src="/sunrisestake.svg"
          width={128}
        />
      </a>
    </>
  )
}

export {
  Result,
}
