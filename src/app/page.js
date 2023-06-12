import { SolFeesApp } from "@/components/SolFeesApp";

export async function generateMetadata() {
  return {
    metadataBase: new URL('https://solfees.fyi'),
    title: 'solfees.fyi',
    description: 'Check how much a Solana wallet has spent on fees',
    openGraph: {
      title: 'solfees.fyi',
      description: 'Check how much a Solana wallet has spent on fees',
      url: '/',
      siteName: 'solfees.fyi',
      images: [{
        url: '/solfeesfyi-2.jpeg',
        width: 700,
        height: 350,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'solfees.fyi',
      description: 'Check how much a Solana wallet has spent on fees',
      creator: '@ronnyhaase',
      images: ['/solfeesfyi-2.jpeg'],
    },
  }
}

export default function Home() {
  return (
    <>
      <SolFeesApp />
    </>
  )
}
