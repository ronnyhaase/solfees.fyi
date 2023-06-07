"use client";

import classNames from 'classnames'
import { useState } from 'react';
import useSWR from 'swr'

const SOL_PER_LAMPORT = 0.000000001

const isBase58 = value => /^[1-9ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]*$/.test(value)

const Form = ({ setAddress }) => {
  const [value, setValue] = useState('')

  const handleInputChange = (ev) => {
    setValue(ev.target.value)
  }

  const handleFormSubmit = (ev) => {
    ev.preventDefault()
    setAddress(value)
  }

  return (
    <div className="bg-purple-100">
      <form className="container flex items-center justify-center py-4" onSubmit={handleFormSubmit}>
        <label className="sr-only sm:not-sr-only">Address:</label>
        <input
          className={classNames(
            "border",
            "border-purple-500",
            "border-solid",
            "mx-2",
            "px-4",
            "py-2",
            "rounded-md",
          )}
          onChange={handleInputChange}
          placeholder="wtfXqc5AzvRUA5ob1UgjwTrcPcoD9bSqxzkPfHLAWye"
        />
        <button
          className={classNames(
            "bg-purple-500",
            "rounded-md",
            "text-white",
            "px-4",
            "py-2",
          )}
          type="submit"
        >
          Let&apos;s go!
        </button>
      </form>
    </div>
  )
}

const Result = ({ data, isLoading, solPrice }) => {
  return (
    <div className="container mt-8 text-3xl">
      {isLoading ? (
        <div className="text-center mx-auto py-8">
          <svg className="inline animate-spin -ml-1 mr-3 h-10 w-10 text-purple-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : null}
      {!data && !isLoading ? (
        <>
          See how much a Solana wallet spent on fees, by entering it&apos;s address. ☝️
        </>
      ) : null}
      {data && !isLoading ? (
        <div className="">
          <p>
            The account spent{' '}
            <span className="text-solana">
              {(data.feesTotal * SOL_PER_LAMPORT).toFixed(5)} ◎{' '}
            </span>
            of fees on{' '}
            <span className="text-solana">{data.transactionsCount} transactions</span>.
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
          <p className="my-2 text-4xl font-bold text-center text-solana">
            OPOS
          </p>
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
      <main>
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
      <footer className="container mt-16">
        This little tool was built by your favorite Solana fren,<br />
        &copy; <a href="https://ronnyhaase.com">Ronny Haase</a>, 2023<br />
        <br />
        It is free software under <a href="https://www.gnu.org/licenses/gpl-3.0">
        GNU General Public License version 3</a> and you&apos;re invited{' '}
        <a href="https://github.com/ronnyhaase/solfees.wtf">to contribute</a>.<br />
        This program comes with ABSOLUTELY NO WARRANTY.
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
