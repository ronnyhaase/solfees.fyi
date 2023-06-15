"use client";

import { Transition } from '@headlessui/react';
import classNames from 'classnames'
import { useLayoutEffect, useState } from 'react'

import {
  TX_CAP,
  useSolPrice,
  useTransactionAggregator,
  useTransactions,
} from '@/hooks'
import { SOL_PER_LAMPORT, isSolanaAddress } from '@/utils'

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
  `I have spent only ${fees}$ on all of my ${transactions} Solana transaction fees!%2A%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi%3Fxyz by %40ronnyhaase !%0A%0A%2AAt current SOL price`

const Result = ({ summary, solPrice }) => summary ? (
  <div className="mt-8">
      <p>
        This account has spent{' '}
        <span className="text-solana-purple">
          {(summary.feesTotal * SOL_PER_LAMPORT).toFixed(5)} ◎{' '}
        </span>
        in fees for{' '}
        <span className="text-solana-purple">{summary.transactionsCount} transactions</span>.
        {summary.transactionsCount >= TX_CAP ? (
          <span className="block text-blue-500 text-sm">ℹ︎ We&apos;re currently stopping at {TX_CAP} transactions, sorry!</span>
        ) : null}
      </p>
      <p>
        <u className="underline underline-offset-4">Right now</u>, that&apos;s{' '}
        <span className="text-solana-purple">
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
    Check how much a Solana wallet has spent on transaction fees, by entering it&apos;s
    address. ☝️
  </div>
) : null

const LoadingIndicator = ({ isLoading, progress }) => {
  const sharedCircleClasses = ["animate-zoom absolute top-0 left-0 h-full opacity-60 bg-solana-green rounded-[50%] w-full"]

  return isLoading ? (
    <div className="items-center flex flex-col text-center text-lg">
      <div className="h-10 m-4 relative w-10">
          <div
            className={classNames(sharedCircleClasses, "bg-solana-green" )}
          />
          <div
            className={classNames(sharedCircleClasses, "animation-delay-750", "bg-solana-purple")}
          />
      </div>
      <div>
        <strong className="block font-bold">
          Stay tuned, this may takes a little while...
        </strong>
        So far {progress} transactions, and counting.
      </div>
    </div>
  ) : null
}

const About = () => (
  <div className="text-sm">
    <p className="mb-2 flex flex-col text-center">
      <span>This useless tool was built by your favorite Solana fren,</span>
      <span>
        <a href="https://twitter.com/ronnyhaase">
          <img
            alt="Ronny Haase PFP"
            className="inline"
            src="/ronnyhaase.png"
          />
        </a>
      </span>
      <span>&copy; <a href="https://twitter.com/ronnyhaase">Ronny Haase</a>, 2023</span>
    </p>
    <p className="mb-2">
      It is free software under <a href="https://www.gnu.org/licenses/gpl-3.0">
      GNU General Public License version 3</a> and you&apos;re invited{' '}
      <a href="https://github.com/ronnyhaase/solfees.fyi">to contribute</a>.
      <br />
      This program comes with ABSOLUTELY NO WARRANTY.
    </p>
  </div>
)

const SolFeesApp = () => {
  const [address, setAddress] = useState(null)
  const { price } = useSolPrice()
  const { transactions, isLoading, progress, error } = useTransactions(address)
  const summary = useTransactionAggregator(address, transactions)

  const [appReady, setAppReady] = useState(false)
  useLayoutEffect(() => {
    setAppReady(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Transition
        as="header"
        show={appReady}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 -translate-y-full"
        enterTo="opacity-100 translate-y-0"
      >
        <Form setAddress={setAddress} />
      </Transition>
      <ErrorDisplay error={error} />
      <div className="flex flex-col grow mt-8 overflow-y-hidden px-2">
        <Transition
          className={classNames(
            "bg-white",
            "flex",
            "flex-col",
            "grow",
            "max-w-2xl",
            "min-w-2xl",
            "mx-auto",
            "px-2",
            "sm:px-4",
            "md:px-8",
            "py-2",
            "rounded-t-lg",
            "shadow-2xl",
          )}
          show={appReady}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
        >
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
        </Transition>
      </div>
    </div>
  )
}

export { SolFeesApp }
