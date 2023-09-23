import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

async function POST() {
  try {
    await fetch(`https://api.dune.com/api/v1/query/3045220/results?api_key=${
      process.env.DUNE_KEY
    }`)
      .then(res => res.json())
      .then(body => body.result.rows[0])
      .then(data => kv.set('avg_gas_usage', data))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500})
  }
}

export {
  POST,
}
