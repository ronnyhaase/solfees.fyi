import PlausibleProvider from 'next-plausible'
import './globals.css'
import classNames from 'classnames'

export const metadata = {
  title: 'solfees.fyi',
  description: 'Check how much a Solana wallet has spent on fees',
}

export default function RootLayout({ children }) {
  return (
    <html
      className={classNames(
        "bg-gradient-to-tr",
        "font-sans",
        "from-[#f67cb9]",
        "min-h-full",
        "min-w-full",
        "overflow-y-scroll",
        "relative",
        "text-gray-800",
        "to-[#f0c996]",
      )}
      lang="en"
    >
      <head>
        <PlausibleProvider domain="solfees.fyi" />
      </head>
      <body className="min-h-screen min-w-screen text-lg">{children}</body>
    </html>
  )
}
