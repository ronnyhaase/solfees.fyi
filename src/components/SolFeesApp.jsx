"use client";

import { Transition } from '@headlessui/react'
import clx from 'classnames';
import { useLayoutEffect, useState } from 'react'
import Confetti from 'react-confetti';
import { useMeasure } from 'react-use'

import {
  useSolPrice,
  useTransactions,
} from '@/hooks'
import { About, ErrorDisplay, Progress, Result, SunriseAd, WalletForm } from '@/components/molecules';
import { FadeInOutTransition, LoadingIndicator } from '@/components/atoms';

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
    <main ref={measureRef} className="min-h-screen flex flex-col items-center justify-center px-2">
      <FadeInOutTransition
        show={((appReady && state === 'intro') || state === 'error') && !isElementLeaving}
        beforeLeave={setElementLeaving}
        afterLeave={setElementNotLeaving}
      >
        <ErrorDisplay error={error} />
        <WalletForm setAddress={setAddress} />
      </FadeInOutTransition>
      <FadeInOutTransition
        show={(state === 'loading' || state === 'resolving') && !isElementLeaving}
        beforeLeave={setElementLeaving}
        afterLeave={setElementNotLeaving}
      >
        <Progress state={state} progress={progress} />
      </FadeInOutTransition>
      <Transition
        show={state === 'done'}
        beforeLeave={setElementLeaving}
        afterLeave={setElementNotLeaving}
        enter="transition-opacity transition-transform duration-200 ease-in"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        className={clx(
          'grow',
          'flex',
          'flex-col',
          'w-full',
          'max-w-2xl',
          'mx-auto',
          'mt-2 sm:mt-4 md:mt-8',
          'pt-2 sm:pt-4 md:pt-8',
          'px-2 sm:px-4 md:px-8',
          'rounded-t-lg',
          'bg-white',
          'shadow-2xl',
        )}
      >
        <div className="grow">
          <Result summary={summary} solPrice={price} />
          <SunriseAd className="mt-12" />
        </div>
        <About className="mt-12" />
      </Transition>
      {state === 'done' ? (
        <Confetti
          gravity={0.5}
          height={confettiHeight}
          numberOfPieces={200}
          recycle={false}
          run={state === 'done'}
          width={confettiWidth}
        />
      ) : null}
    </main>
  )
}

export { SolFeesApp }
