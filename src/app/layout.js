import { Noto_Sans } from 'next/font/google'
import PlausibleProvider from 'next-plausible'
import classNames from 'classnames'

import './globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-notosans',
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html
      className={classNames(
        notoSans.variable,
        "bg-gradient-to-tr",
        "font-sans",
        "from-[#f67cb9]",
        "min-h-full",
        "overflow-y-scroll",
        "text-gray-800",
        "to-[#f0c996]",
      )}
      lang="en"
    >
      <head>
        <PlausibleProvider domain="solfees.fyi" />
      </head>
      <body className="min-h-screen text-lg">{children}</body>
    </html>
  )
}
