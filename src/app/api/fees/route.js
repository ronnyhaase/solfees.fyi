import { kv } from '@vercel/kv'
import BigNumber from 'bignumber.js'
import { NextResponse } from 'next/server'

function fetchPrices() {
  const token = {
    eth: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    matic: 'Gz7VkD4MacbEB6yC5XD3HcumEiYx2EtDYYrfikGsvopG',
    sol: 'So11111111111111111111111111111111111111112',
  }

  const url = 'https://public-api.birdeye.so/public/multi_price?list_address='
    + `${token.eth},${token.matic},${token.sol}`

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Chain': 'solana',
    },
  })
    .then(res => res.json())
    .then(body => ({
      eth: new BigNumber(body.data[token.eth].value)
        .decimalPlaces(5)
        .toNumber(),
      matic: new BigNumber(body.data[token.matic].value)
        .decimalPlaces(5)
        .toNumber(),
      sol: new BigNumber(body.data[token.sol].value)
        .decimalPlaces(5)
        .toNumber(),
    }))
}

async function GET () {
  const [avgGasFees, avgTxGasUsage, prices] = await Promise.all([
    kv.get('avg_gas_fees'),
    kv.get('avg_gas_usage'),
    fetchPrices(),
  ])

  const data = {
    avgGasFees,
    avgTxGasUsage,
    prices,
  }

  return NextResponse.json(data)
}

export {
  GET,
}
