"use client";

import {
  TX_CAP,
  useSolPrice,
  useTransactionAggregator,
  useTransactions,
} from '@/hooks'
import { isSolanaAddress } from '@/utils';
import classNames from 'classnames'
import { useState } from 'react'

const SOL_PER_LAMPORT = 0.000000001

const Form = ({ setAddress }) => {
  const [value, setValue] = useState('')
  const [valid, setValid] = useState(true)

  const handleInputChange = (ev) => {
    const val = ev.target.value.trim()

    setValue(val)
    setValid(isSolanaAddress(val) || !val)
  }

  const handleFormSubmit = (ev) => {
    ev.preventDefault()
    setAddress(value)
  }

  return (
    <div className="bg-black/10">
      <form className="flex items-center justify-center py-4" onSubmit={handleFormSubmit}>
        <label className="sr-only sm:not-sr-only">Address:</label>
        <input
          className={classNames(
            "border-2",
            valid ? "border-purple-400" : "border-red-400",
            "border-solid",
            "mr-2",
            "sm:mx-2",
            "outline-none",
            "px-4",
            "py-2",
            "rounded-md",
            "shadow",
          )}
          onChange={handleInputChange}
          placeholder="wtfXqc5AzvRUA5ob1UgjwTrcPcoD9bSqxzkPfHLAWye"
        />
        <button
          className={classNames(
            valid ? "bg-purple-500" : "bg-purple-400",
            "shadow",
            "rounded-md",
            valid ? "text-white" : "text-gray-300",
            "px-4",
            "py-2",
          )}
          disabled={!isSolanaAddress(value)}
          type="submit"
        >
          Let&apos;s go!
        </button>
      </form>
    </div>
  )
}

const generateTweetMessage = (fees, transactions) =>
  `I have spent only ${fees}$ on all of my ${transactions} Solana transactions!%2A%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi%3Fxyz by %40ronnyhaase !%0A%0A%2AAt current SOL price`

const Result = ({ summary, solPrice }) => summary ? (
  <div className="mt-8">
      <p>
        This account has spent{' '}
        <span className="text-solana">
          {(summary.feesTotal * SOL_PER_LAMPORT).toFixed(5)} ◎{' '}
        </span>
        in fees for{' '}
        <span className="text-solana">{summary.transactionsCount} transactions</span>.
        {summary.transactionsCount >= TX_CAP ? (
          <span className="block text-blue-500 text-sm">ℹ︎ We&apos;re currently stopping at {TX_CAP} transactions, sorry!</span>
        ) : null}
      </p>
      <p>
        <u className="underline underline-offset-4">Right now</u>, that&apos;s{' '}
        <span className="text-solana">
          {solPrice ? (
            <>{(summary.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2)} $</>
          ) : (
            <><span>¯\_(ツ)_/¯</span> $</>
          )}
        </span>
        .
      </p>
      <p
        className={classNames(
          "drop-shadow-lg",
          "font-bold",
          "from-solana",
          "bg-clip-text",
          "bg-gradient-to-br",
          "my-12",
          "text-6xl",
          "text-center",
          "text-transparent",
          "to-[#14F195]",
        )}
      >
        OPOS
      </p>
      <div className="flex justify-center my-4">
        <a
          className={classNames(
            "bg-[#0C9DED]",
            "px-8",
            "py-4",
            "rounded-full",
            "text-lg",
            "text-white",
          )}
          href={`https://twitter.com/share?text=${generateTweetMessage(
            (summary.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2),
            summary.transactionsCount
          )}`}
        >Tweet it!</a>
      </div>
      <a
        className="block max-w-xs mx-auto mt-12 text-center text-base text-[#145D3E]"
        href="https://app.sunrisestake.com"
      >
        If you like this tool, thank me by offsetting emissions while you sleep.<br />
        <img
          className="inline max-w-[128px]"
          alt="Sunrise Stake - Offset emissions while you sleep."
          src="/sunrisestake.svg"
        />
      </a>
    </div>
) : null

const ErrorDisplay = ({ error }) => error ? (
  <div className="bg-red-500/50 border-b border-b-white/80 border-solid border-t border-t-black/20 text-white">
    <div className="container max-w-2xl py-4">
    <div className="text-2xl">Oops...</div>
    <p>
      {error.message}
    </p>
    </div>
  </div>
) : null

const Intro = ({ show }) => show ? (
  <div className="mt-8">
    Check how much a Solana wallet has spent on fees, by entering it&apos;s
    address. ☝️
  </div>
) : null

const LoadingIndicator = ({ isLoading, progress }) => isLoading ? (
  <div className="mx-auto py-8 text-center text-sm">
    <svg className="inline animate-spin -ml-1 mr-3 h-10 w-10 text-purple-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <div>
      <strong className="block font-bold">
        Stay tuned, this may takes a little while...
      </strong>
      So far {progress} transactions, and counting.
    </div>
  </div>
) : null

const About = () => (
  <div className="text-sm">
    <p className="mb-2">
      This little tool was built by your favorite Solana fren,<br />
      &copy; <a href="https://ronnyhaase.com">Ronny Haase</a>, 2023<br />
    </p>
    <p className="mb-2">
      The transaction data are powered by {' '}
      <span className="text-red-700 whitespace-nowrap">
        <a href="https://www.helius.dev/">
          Helius
        </a>
        {' '}&hearts;
      </span> and the SOL/USD price is powered by {' '}
      <span className="text-red-700 whitespace-nowrap">
        <a href="https://birdeye.so/">
          Birdeye
        </a>
        {' '}&hearts;
      </span>
    </p>
    <p className="mb-2">
      It is free software under <a href="https://www.gnu.org/licenses/gpl-3.0">
      GNU General Public License version 3</a> and you&apos;re invited{' '}
      <a href="https://github.com/ronnyhaase/solfees.fyi">to contribute</a>.
      <br />
      This program comes with ABSOLUTELY NO WARRANTY.
    </p>
    <div className="text-center">
      <img
        alt="Ronny Haase PFP"
        className="inline"
        src="/ronnyhaase.png"
      />
    </div>
  </div>
)

const SolFeesApp = () => {
  const [address, setAddress] = useState(null)
  const { price } = useSolPrice()
  const { transactions, isLoading, progress, error } = useTransactions(address)
  const summary = useTransactionAggregator(address, transactions)

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Form setAddress={setAddress} />
      </header>
      <ErrorDisplay error={error} />
      <div className="flex flex-col grow mt-8 px-2">
        <div className="bg-white flex flex-col grow max-w-2xl min-w-2xl mx-auto px-2 sm:px-4 md:px-8 py-2 rounded-t-lg shadow-2xl">
          <main className="grow text-3xl">
            <Intro show={!transactions && !isLoading} />
            <LoadingIndicator isLoading={isLoading} progress={progress} />
            <Result
              summary={summary}
              solPrice={price?.data?.value}
            />
          </main>
          <footer className="mt-8 sm:mt-16 sm:px-16">
            <About />
          </footer>
        </div>
      </div>
    </div>
  )
}

export { SolFeesApp }
