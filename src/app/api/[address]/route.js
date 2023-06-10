import { Connection, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms))

const runtime = 'edge'

async function GET (_, { params: { address } }) {
  const account = await new Connection(`https://rpc.helius.xyz/?api-key=${process.env.API_KEY}`)
    .getAccountInfo(new PublicKey(address))
  if (!account || !account.owner) return NextResponse.json({}, { status: 404 })
  if (account.owner.toString() !== '11111111111111111111111111111111') return NextResponse
    .json({}, { status: 400 })

  let transactions = []
  let partial = []
  let prevLast = undefined
  while (true) {
    partial = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${
        process.env.API_KEY}${prevLast ? `&before=${prevLast}` : ''}`
    ).then(r => r.json())

    if (!partial.length) break;

    transactions = transactions.concat(partial)
    prevLast = partial.slice(-1)[0].signature

    if (transactions.length >= 1000) break;

    await sleep(500)
  }

  let data = { transactionsCount: transactions.length, feesAvg: 0, feesTotal: 0 }
  transactions.map((tx) => {
    if (tx.feePayer === address) {
      data.feesTotal += tx.fee
    }
  })
  data.feesAvg = data.transactionsCount !== 0
    ? data.feesTotal / data.transactionsCount
    : 0

  return NextResponse.json(data)
}

export {
  GET,
  runtime,
}
