"use client";

import classNames from 'classnames'
import { useState } from 'react';
import useSWR from 'swr'

const SOL_PER_LAMPORT = 0.000000001

const isSolanaAddress = value => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const Form = ({ setAddress }) => {
  const [value, setValue] = useState('')
  const [valid, setValid] = useState(true)

  const handleInputChange = (ev) => {
    const val = ev.target.value.trim()

    setValue(val)
    setValid(isSolanaAddress(ev.target.value.trim()) || !ev.target.value)
  }

  const handleFormSubmit = (ev) => {
    ev.preventDefault()
    setAddress(value)
  }

  return (
    <div className="bg-purple-200">
      <form className="flex items-center justify-center py-4" onSubmit={handleFormSubmit}>
        <label className="sr-only sm:not-sr-only">Address:</label>
        <input
          className={classNames(
            "border-2",
            valid ? "border-purple-500" : "border-red-800",
            "border-solid",
            "mx-2",
            "outline-none",
            "px-4",
            "py-2",
            "rounded-md",
          )}
          onChange={handleInputChange}
          placeholder="wtfXqc5AzvRUA5ob1UgjwTrcPcoD9bSqxzkPfHLAWye"
        />
        <button
          className={classNames(
            valid ? "bg-purple-500" : "bg-purple-400",
            "rounded-md",
            valid ? "text-white" : "text-gray-100",
            "px-4",
            "py-2",
          )}
          disabled={!valid}
          type="submit"
        >
          Let&apos;s go!
        </button>
      </form>
    </div>
  )
}

const generateTweetMessage = (fees, transactions) =>
  `I have spent only ${fees}$ on all of my ${transactions} Solana transactions!%0A%0AOPOS.%0A%0ACheck yours at https://www.solfees.fyi!`

const Result = ({ data, isLoading, solPrice }) => {
  return (
    <div className="mt-8 text-3xl">
      {isLoading ? (
        <div className="text-center mx-auto py-8 text-sm">
          <svg className="inline animate-spin -ml-1 mr-3 h-10 w-10 text-purple-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>Stay tuned, this may takes a little while...</div>
        </div>
      ) : null}
      {!data && !isLoading ? (
        <>
          Check how much a Solana wallet has spent on fees, by entering it&apos;s address. ☝️
        </>
      ) : null}
      {data && !isLoading ? (
        <div>
          <p>
            This account has spent{' '}
            <span className="text-solana">
              {(data.feesTotal * SOL_PER_LAMPORT).toFixed(5)} ◎{' '}
            </span>
            in fees for{' '}
            <span className="text-solana">{data.transactionsCount} transactions</span>.
            {data.transactionsCount >= 1000 ? (
              <div className="text-blue-500 text-sm">ℹ︎ We&apos;re currently stopping at 1000 transactions, sorry</div>
            ) : null}
          </p>
          <p>
            Right now, that&apos;s{' '}
            <span className="text-solana">
              {solPrice ? (
                <>{(data.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2)} $</>
              ) : (
                <><span>¯\_(ツ)_/¯</span> $</>
              )}
            </span>.
          </p>
          <p
            className={classNames(
              "my-12",
              "text-6xl",
              "font-bold",
              "text-transparent",
              "bg-clip-text",
              "bg-gradient-to-br",
              "from-solana",
              "to-[#14F195]",
              "drop-shadow-lg",
              "text-center"
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
                (data.feesTotal * SOL_PER_LAMPORT * solPrice).toFixed(2),
                data.transactionsCount
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
      ) : null}
    </div>
  )
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

const SolFeesApp = () => {
  const [address, setAddress] = useState(null)

  const { data: fees, error: feesError, isLoading: isLoadingFees } = useSWR(
    address ? `/api/${address}` : null,
    fetcher,
  )
  const { data: price, error: priceError, isLoading: isLoadingPrice } = useSWR(
    'https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112',
    fetcher,
  )

  return (
    <>
      <header>
        <Form setAddress={setAddress} />
      </header>
      <main className="container max-w-2xl">
        {feesError ? (<div className="bg-red-800 container text-white">
          <div className="text-xl">Oops...</div>
          <p>
            {feesError.message}
          </p>
        </div>) : null}
        <Result
          data={fees}
          isLoading={isLoadingFees}
          solPrice={price?.data?.value}
        />
      </main>
      <footer className="container max-w-xl mt-16">
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
      </footer>
    </>
  )
}

export { SolFeesApp }
