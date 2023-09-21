import BigNumber from 'bignumber.js'
import clx from 'classnames'
import { useMemo } from 'react'

import { GAS_DENOMINATOR, TX_CAP } from '@/constants'
import { Button } from '@/components/atoms'
import { IoRepeatSharp } from 'react-icons/io5'

const generateTweetMessage = (fees, transactions) =>
  `I spent only $${fees} in fees for all of my ${transactions} Solana transaction, at the current SOL price!%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi%3Fxyz by %40ronnyhaase !`

const Result = ({ className, reset, summary, pricesAndFees }) => {
  const data = useMemo(() => {
    let data = {}
    if (summary) {
      data = {
        firstTransaction : new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          }).format(new Date(summary.firstTransactionTS)),
        solFees: new BigNumber(summary.feesTotal)
          .multipliedBy(GAS_DENOMINATOR)
          .decimalPlaces(5)
          .toNumber(),
        txCount: summary.transactionsCount,
        txCountUnpaid: summary.unpaidTransactionsCount,
        solAvgFee: new BigNumber(summary.feesAvg)
          .multipliedBy(GAS_DENOMINATOR)
          .decimalPlaces(6)
          .toNumber()
      }
    }
    if (pricesAndFees && summary) {
      data.usdFees = new BigNumber(summary.feesTotal)
        .multipliedBy(GAS_DENOMINATOR)
        .multipliedBy(pricesAndFees.prices.sol)
        .decimalPlaces(2)
        .toNumber()
      data.usdAvgFee = new BigNumber(summary.feesAvg)
        .multipliedBy(GAS_DENOMINATOR)
        .multipliedBy(pricesAndFees.prices.sol)
        .decimalPlaces(6)
        .toNumber()
    }

    return data
  }, [summary, pricesAndFees])

  const tweetMessage = generateTweetMessage(data.usdFees, data.txCount)

  return (
    <div className={className}>
      <p>
        This account has spent{' '}
        <span className="text-solana-purple">
          ◎ {data.solFees}{' '}
        </span>
        in fees for{' '}
        <span className="text-solana-purple">{data.txCount} transactions</span>.
        {data.txCount >= TX_CAP ? (
          <span className="block text-blue-500 text-sm">
            ℹ︎ We&apos;re currently stopping at {TX_CAP} transactions, sorry!
          </span>
        ) : null}
      </p>
      <p>
        <u className="underline underline-offset-4">Right now</u>, that&apos;s{' '}
        <span className="text-solana-purple">
            $ {data.usdFees}
        </span>
        .
      </p>
      <div className="mt-2 text-lg">
        <p>
          The account paid for {data.txCount - data.txCountUnpaid} of the {data.txCount}
          &nbsp;transactions. On average, it paid <span className="whitespace-nowrap">◎
          &nbsp;{data.solAvgFee} ($ {data.usdAvgFee})</span> per transaction.</p>
        <p>The very first transaction was sent on {data.firstTransaction}</p>
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
