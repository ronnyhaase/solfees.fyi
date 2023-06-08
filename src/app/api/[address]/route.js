import { NextResponse } from 'next/server'

const sleep = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms))

async function GET (_, { params: { address } }) {
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

export { GET }
