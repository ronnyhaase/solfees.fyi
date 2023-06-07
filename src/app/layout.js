import './globals.css'

export const metadata = {
  title: 'solfees.wtf',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-lg">{children}</body>
    </html>
  )
}
