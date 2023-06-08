import './globals.css'

export const metadata = {
  title: 'solfees.fyi',
  description: 'Check how much a Solana wallet has spent on fees',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-lg">{children}</body>
    </html>
  )
}
