"use client";

import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useMeasure } from 'react-use'

import {
  useSolPrice,
  useTransactions,
} from '@/hooks'
import { isSolanaAddress, isSolanaDomain  } from '@/utils'
import { LoadingIndicator, Result } from './';

const Form = ({ setAddress }) => {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleInputChange = (ev) => {
    const val = ev.target.value.trim()

    setValue(val)
    setIsValid(isSolanaAddress(val) || isSolanaDomain(val) || !val)
  }

  const handleFormSubmit = async (ev) => {
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
            isValid ? "border-purple-400" : "border-red-400",
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
            isValid ? "bg-purple-500" : "bg-purple-400",
            "shadow",
            "rounded-md",
            isValid ? "text-white" : "text-gray-300",
            "px-4",
            "py-2",
          )}
          disabled={!isSolanaAddress(value) && !isSolanaDomain(value)}
          type="submit"
        >
          Let&apos;s go!
        </button>
      </form>
    </div>
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
    Check how much a Solana wallet has spent on transaction fees, by entering it&apos;s address. ☝️
  </div>
)

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
    progress,
    summary,
    state,
  } = useTransactions(address)

  const [appReady, setAppReady] = useState(false)
  useLayoutEffect(() => {
    setAppReady(true)
  }, [])
  const [measureRef, { width: confettiWidth, height: confettiHeight }] = useMeasure()
  const [isElementLeaving, setIsElementLeaving] = useState(false)
  const setElementLeaving = () => setIsElementLeaving(true)
  const setElementNotLeaving = () => setIsElementLeaving(false)

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
              "text-slate-600",
              "w-full",
            )}
            enter="transition-opacity transition-transform duration-200 ease-in"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
          >
            <main className="grow text-3xl">
              <FadeInOutTransition
                show={(state === 'error') && !isElementLeaving}
                beforeLeave={setElementLeaving}
                afterLeave={setElementNotLeaving}
              >
                <ErrorDisplay error={error} />
                <Info />
              </FadeInOutTransition>
              <FadeInOutTransition
                show={(state === 'intro') && !isElementLeaving}
                beforeLeave={setElementLeaving}
                afterLeave={setElementNotLeaving}
              >
                <Info />
              </FadeInOutTransition>
              <FadeInOutTransition
                show={(state === 'loading' || state === 'resolving') && !isElementLeaving}
                beforeLeave={setElementLeaving}
                afterLeave={setElementNotLeaving}
              >
                <LoadingIndicator state={state} progress={progress} />
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
