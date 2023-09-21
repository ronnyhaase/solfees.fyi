import { GAS_DENOMINATOR, STANDARDTRANSFER_GASCOST } from "@/constants"
import BigNumber from "bignumber.js"
import { NextResponse } from "next/server"

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

function fetchEthFees() {
  const query = `query GasPrices {
    ethereum { gasPrices { floor } }
    polygon { gasPrices { floor } }
  }`
  return fetch('https://api.quicknode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.QUICKNODE_KEY,
    },
    body: JSON.stringify({ query }),
  })
    .then(resp => resp.json())
    .then(body => ({
      // Gas price is returned in WEI -> GWEI -> GWEI × standard TX gas
      ethereum: new BigNumber(body.data.ethereum.gasPrices[0].floor)
        .multipliedBy(GAS_DENOMINATOR)
        .multipliedBy(STANDARDTRANSFER_GASCOST)
        .decimalPlaces(5)
        .toNumber(),
      polygon: new BigNumber(body.data.polygon.gasPrices[0].floor)
        .multipliedBy(GAS_DENOMINATOR)
        .multipliedBy(STANDARDTRANSFER_GASCOST)
        .decimalPlaces(5)
        .toNumber(),
    }))
}

/**
 * Returns current prices of ETH, MATIC and SOL and gas cost per standard transaction in GWEI
 */
async function GET () {
  const [prices, fees] = await Promise.all([fetchPrices(), fetchEthFees()])
  const data = {
    prices,
    fees,
  }
  return NextResponse.json(data)
}

export {
  GET,
}
