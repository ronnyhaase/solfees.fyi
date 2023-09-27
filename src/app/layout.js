import { Noto_Sans } from 'next/font/google'
import PlausibleProvider from 'next-plausible'
import clx from 'classnames'

require('./styles.css')

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-notosans',
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html
      className={clx(
        notoSans.variable,
        "bg-gradient-to-tr",
        "font-sans",
        "from-[#f67cb9]",
        "min-h-full",
        "overflow-y-scroll",
        "text-slate-700",
        "to-[#f0c996]",
      )}
      lang="en"
    >
      <head>
        <PlausibleProvider domain="solfees.fyi" />
      </head>
      <body className="min-h-screen overflow-hidden text-lg">{children}</body>
    </html>
  )
}
