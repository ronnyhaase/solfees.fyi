"use client";

import { Transition } from '@headlessui/react';
import classNames from 'classnames'
import Image from 'next/image';
import { useEffect, useLayoutEffect, useState } from 'react'
import Confetti from 'react-confetti';
import { useMeasure, useWindowSize } from 'react-use';

import {
  TX_CAP,
  useSolPrice,
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

const Result = ({ summary, solPrice }) => {
  const [cachedSummary, setCachedSummary] = useState(null)
  useEffect(() => {
    setCachedSummary(summary ? summary : cachedSummary)
  }, [summary])

  const solFees = cachedSummary ? (cachedSummary.feesTotal * SOL_PER_LAMPORT).toFixed(5) : 0
  const txCount = cachedSummary ? cachedSummary.transactionsCount : 0
  const usdFees = cachedSummary && solPrice ? (cachedSummary.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2) : 0
  const tweetMessage = generateTweetMessage(usdFees, txCount)

  return (
    <>
      <p>
        This account has spent{' '}
        <span className="text-solana-purple">
          {solFees} ◎{' '}
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
            <>{usdFees} $</>
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

const ErrorDisplay = ({ error }) => {
  const [cachedMessage, setCachedMessage] = useState('...')
  useEffect(() => {
    setCachedMessage(error ? error.message : cachedMessage)
  }, [error])

  return (
    <div className="bg-red-400 mb-4 p-4 rounded-lg text-white">
      <div>Oops...</div>
      <p className='text-2xl'>
        {cachedMessage}
      </p>
    </div>
  )
}

const Info = () => (
  <div>
    Check how much a Solana wallet has spent on transaction fees, by entering it&apos;s
    address. ☝️
  </div>
)

const LoadingIndicator = ({ progress = 0 }) => {
  const sharedCircleClasses = ["animate-zoom h-10 opacity-60 rounded-[50%] w-10"]

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
        So far {progress} transactions, and counting.
      </div>
    </div>
  )
}

const About = () => (
  <div className="text-sm">
    <p className="mb-2 flex flex-col text-center">
      <span>This useless tool was built by your favorite Solana fren,</span>
      <span>
        <a href="https://twitter.com/ronnyhaase">
          <Image
            alt="Ronny Haase PFP"
            className="inline"
            height={128}
            priority
            src="/ronnyhaase.png"
            width={128}
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

const FadeInOutTransition = ({ children, ...rest }) => (
  <Transition
    enter="duration-200 ease-in transition-opacity"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="duration-200 ease-out transition-opacity"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    {...rest}
  >
    {children}
  </Transition>
)

const SolFeesApp = () => {
  const [address, setAddress] = useState(null)
  const { price } = useSolPrice()
  const {
    error,
    isLoading,
    progress,
    summary,
    transactions,
  } = useTransactions(address)

  const [appReady, setAppReady] = useState(false)
  useLayoutEffect(() => {
    setAppReady(true)
  }, [])
  const [measureRef, { width: confettiWidth, height: confettiHeight }] = useMeasure()

  const [state, setState] = useState('intro')
  useEffect(() => {
    let newState
    if (!isLoading && !transactions && !error) newState = 'intro'
    else if (isLoading && !transactions && !error) newState = 'loading'
    else if (!isLoading && transactions && !error) newState = 'done'
    else if (error) newState = 'error'
    setState(newState)
  }, [error, isLoading, transactions])

  const [isElementLeaving, setIsElementLeaving] = useState(false)

  return (
    <>
      {state === 'done' ? (
        <Confetti
          height={confettiHeight}
          numberOfPieces={200}
          recycle={false}
          run={state === 'done'}
          width={confettiWidth}
        />
      ) : null}
      <Transition
        show={appReady}
        className="flex flex-col min-h-screen"
      >
        <Transition.Child
          as="header"
          enter="transition-opacity transition-transform duration-200 ease-in"
          enterFrom="opacity-0 -translate-y-full"
          enterTo="opacity-100 translate-y-0"
        >
          <Form setAddress={setAddress} />
        </Transition.Child>
        <div
          className="flex flex-col grow mt-8 overflow-y-hidden px-2"
          ref={measureRef}
        >
          <Transition.Child
            className={classNames(
              "bg-white",
              "flex",
              "flex-col",
              "grow",
              "max-w-2xl",
              "mx-auto",
              "pt-2",
              "sm:pt-4",
              "md:pt-8",
              "px-2",
              "sm:px-4",
              "md:px-8",
              "rounded-t-lg",
              "shadow-2xl",
              "w-full",
            )}
            enter="transition-opacity transition-transform duration-200 ease-in"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
          >
            <main className="grow text-3xl">
              <FadeInOutTransition
                show={(state === 'error') && !isElementLeaving}
                beforeLeave={() => setIsElementLeaving(true)}
                afterLeave={() => setIsElementLeaving(false)}
              >
                <ErrorDisplay error={error} />
                <Info />
              </FadeInOutTransition>
              <FadeInOutTransition
                show={(state === 'intro') && !isElementLeaving}
                beforeLeave={() => setIsElementLeaving(true)}
                afterLeave={() => setIsElementLeaving(false)}
              >
                <Info />
              </FadeInOutTransition>
              <FadeInOutTransition
                show={state === 'loading' && !isElementLeaving}
                beforeLeave={() => setIsElementLeaving(true)}
                afterLeave={() => setIsElementLeaving(false)}
              >
                <LoadingIndicator progress={progress} />
              </FadeInOutTransition>
              <FadeInOutTransition
                show={state === 'done' && !isElementLeaving}
                beforeLeave={() => setIsElementLeaving(true)}
                afterLeave={() => setIsElementLeaving(false)}
              >
                <Result
                  summary={summary}
                  solPrice={price?.data?.value}
                />
              </FadeInOutTransition>
            </main>
            <footer className="mt-8 sm:mt-12 sm:px-16">
              <About />
            </footer>
          </Transition.Child>
        </div>
      </Transition>
    </>
  )
}

export { SolFeesApp }
