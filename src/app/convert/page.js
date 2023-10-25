import { ConvertApp } from '@/components/ConvertApp'

export const metadata = {
  metadataBase: new URL('https://www.solfees.fyi/convert'),
  title: 'solfees.fyi • Converter',
  description: 'Find out how much you had spent in Solana transactions.',
  openGraph: {
    title: 'solfees.fyi • Converter',
    description: 'Find out how much you had spent in Solana transactions.',
    url: '/',
    siteName: 'solfees.fyi',
    images: [{
      url: '/convert.jpeg',
      width: 700,
      height: 350,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'solfees.fyi • Converter',
    description: 'Find out how much you had spent in Solana transactions.',
    creator: '@ronnyhaase',
    images: ['/convert.jpeg'],
  },
}

export default function Convert() {
  return (
    <>
      <ConvertApp />
    </>
  )
}