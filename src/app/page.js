import { SolFeesApp } from "@/components/SolFeesApp";

export const metadata = {
  metadataBase: new URL('https://www.solfees.fyi'),
  title: 'solfees.fyi',
  description: 'Check how much a Solana wallet has spent on fees',
  openGraph: {
    title: 'solfees.fyi',
    description: 'Check how much a Solana wallet has spent on fees',
    url: '/',
    siteName: 'solfees.fyi',
    images: [{
      url: '/solfeesfyi.jpeg',
      width: 700,
      height: 350,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'solfees.fyi',
    description: 'Check how much a Solana wallet has spent on fees',
    creator: '@ronnyhaase',
    images: ['/solfeesfyi.jpeg'],
  },
}

export default function Home() {
  return (
    <>
      <SolFeesApp />
    </>
  )
}
