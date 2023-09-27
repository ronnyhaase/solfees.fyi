"use client";

import { Transition } from '@headlessui/react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import clx from 'classnames';
import { useLayoutEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'
import { useMeasure } from 'react-use'

import {
  usePricesAndFees,
  useSolPrice,
  useTransactions,
} from '@/hooks'
import { About, ErrorDisplay, Progress, Result, SunriseAd, WalletForm } from '@/components/molecules';
import { FadeInOutTransition } from '@/components/atoms';

const Providers = ({ children }) => {
  const walletEndpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Mainnet), [])
  const wallets = useMemo(() => [
    new SolflareWalletAdapter(),
  ], [])

  return (
    <ConnectionProvider endpoint={walletEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const SolFeesApp = () => {
  const [address, setAddress] = useState(null)
  const { pricesAndFees } = usePricesAndFees()
  const {
    error,
    progress,
    reset: resetResult,
    summary,
    state,
  } = useTransactions(address)

  const reset = () => {
    resetResult()
    setAddress(null)
  }

  const [appReady, setAppReady] = useState(false)
  useLayoutEffect(() => {
    setAppReady(true)
  }, [])

  const [measureRef, { width: confettiWidth, height: confettiHeight }] = useMeasure()

  const [isElementLeaving, setIsElementLeaving] = useState(false)
  const setElementLeaving = () => setIsElementLeaving(true)
  const setElementNotLeaving = () => setIsElementLeaving(false)

  return (
    <Providers>
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
          show={state === 'done' && !isElementLeaving}
          beforeLeave={setElementLeaving}
          afterLeave={setElementNotLeaving}
          enter="transition-transform duration-200 ease-in"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-200 ease-out"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          className={clx(
            'grow',
            'flex',
            'flex-col',
            'w-full',
            'max-w-5xl',
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
            <Result summary={summary} reset={reset} pricesAndFees={pricesAndFees} />
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
    </Providers>
  )
}

export { SolFeesApp }
