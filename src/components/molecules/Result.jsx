import { Transition } from '@headlessui/react'
import BigNumber from 'bignumber.js'
import clx from 'classnames'
import { useMemo, useState } from 'react'
import { IoGitCompare, IoInformationCircle } from 'react-icons/io5'
import { MdFastRewind } from 'react-icons/md'

import { GAS_DENOMINATOR, TX_CAP } from '@/constants'
import { Button, NoWrap } from '@/components/atoms'

const generateTweetMessage = (fees, transactions) =>
  `I spent only $${fees} in fees for all of my ${transactions} Solana transactions, at the current SOL price!%0A%0A%23OnlyPossibleOnSolana%0A%0ACheck yours at https://www.solfees.fyi by %40ronnyhaase`

const COMPARER_CHAINS = ['ethereum', 'polygon']

const Comparer = ({ txCount, pricesAndFees }) => {
  const [chain, setChain] = useState(COMPARER_CHAINS[0])
  const data = useMemo(() => {
    const symbol = pricesAndFees.symbols[chain]
    const tokenCosts = new BigNumber(txCount)
      .multipliedBy(pricesAndFees.avgTxGasUsage[chain])
      .multipliedBy(pricesAndFees.avgGasFees[chain])
      .multipliedBy(GAS_DENOMINATOR)
      .decimalPlaces(5)
      .toNumber()
    const usdCosts = new BigNumber(tokenCosts)
      .multipliedBy(pricesAndFees.prices[chain])
      .decimalPlaces(2)
      .toNumber()

    return { symbol, tokenCosts, usdCosts }
  }, [chain, pricesAndFees, txCount])

  const handleChainChange = (ev) => setChain(ev.target.value)

  return (
    <div className="my-4 px-2 py-4 rounded-lg bg-slate-100 text-center">
      On
      <select
        className="w-32 mx-2 border-2 border-primary rounded-lg bg-white text-center"
        value={chain}
        onChange={handleChainChange}
      >
        {COMPARER_CHAINS.map((chain) => (
          <option key={chain} value={chain}>{chain[0].toUpperCase() + chain.slice(1)}</option>
        ))}
        <option disabled>More, soon!</option>
      </select>
      you would have paid approximately <NoWrap>{data.symbol} {data.tokenCosts}</NoWrap> or{' '}
      <NoWrap>$ {data.usdCosts}</NoWrap> for {txCount} transactions at the{' '}
      <u className="underline underline-offset-4">current</u> gas price, assuming the average gas
      usage per transaction.
    </div>
  )
}

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
        .multipliedBy(pricesAndFees.prices.solana)
        .decimalPlaces(2)
        .toNumber()
      data.usdAvgFee = new BigNumber(summary.feesAvg)
        .multipliedBy(GAS_DENOMINATOR)
        .multipliedBy(pricesAndFees.prices.solana)
        .decimalPlaces(6)
        .toNumber()
    }

    return data
  }, [summary, pricesAndFees])

  const [showComparer, setShowComparer] = useState(false)
  const handleCompareClick = () => {
    setShowComparer(true)
    window.scrollBy({ behavior: 'smooth', top: 200 })
  }

  const tweetMessage = generateTweetMessage(data.usdFees, data.txCount)

  return (
    <div className={className}>
      {data.txCount >= 0 ? (
        <p className="flex justify-center items-center mb-2 leading-tight text-blue-500 text-base">
          <IoInformationCircle className="inline mr-2" size={32} />
          <span>
            We&apos;re currently stopping at {TX_CAP} transactions, sorry!
          </span>
        </p>
      ) : null}
      <p className="my-2 text-xl md:text-2xl text-center">
        This account has spent{' '}
        <NoWrap className="text-solana-purple">
          ◎ {data.solFees}{' '}
        </NoWrap>
        in fees for{' '}
        <span className="text-solana-purple">{data.txCount} transactions</span>.
      </p>
      <p className="mb-4 text-xl md:text-2xl text-center">
        <u className="underline underline-offset-4">Right now</u>, that&apos;s{' '}
        <NoWrap className="text-solana-purple">
            $ {data.usdFees}
        </NoWrap>
        .
      </p>
      <div className="mt-2">
        <p className="mb-2">
          The account paid for {data.txCount - data.txCountUnpaid} of the {data.txCount}
          &nbsp;transactions. On average, it paid <NoWrap>◎ {data.solAvgFee}</NoWrap>{' '}
          <NoWrap>($ {data.usdAvgFee})</NoWrap> per transaction.</p>
        <p className="mb-4">
          The very first transaction was sent on {data.firstTransaction}
        </p>
      </div>
      <Transition
        enter="duration-200 ease-in transition-opacity"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={showComparer}
      >
        <Comparer txCount={data.txCount - data.txCountUnpaid} pricesAndFees={pricesAndFees} />
      </Transition>
      <div className="flex gap-1 justify-center">
        <Button color="primary" size="sm" onClick={reset}>
          <MdFastRewind size={20} />
          Check Another
        </Button>
        <Transition show={!showComparer}>
          <Button size="sm" onClick={handleCompareClick}>
            <IoGitCompare size={20} />
            Compare Chains
          </Button>
        </Transition>
      </div>
      <p
        className={clx(
          'my-6 md:my-10',
          'font-light',
          'text-solana-purple',
          'text-2xl md:text-4xl',
          'text-center',
          'tracking-tight',
        )}
      >
        #OnlyPossibleOnSolana
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
        >
          Tweet it
        </a>
      </p>
    </div>
  )
}

export {
  Result,
}
