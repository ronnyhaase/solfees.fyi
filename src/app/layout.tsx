import { Analytics } from "@vercel/analytics/next"
import clx from "classnames"
import { Noto_Sans } from "next/font/google"
import { type ReactNode } from "react"

import "./styles.css"

const notoSans = Noto_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "700"],
	variable: "--font-notosans",
	display: "swap",
})

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html
			className={clx(
				notoSans.variable,
				"bg-gradient-to-tr",
				"font-sans",
				"from-[#f67cb9]",
				"min-h-full",
				"overflow-y-scroll",
				"text-secondary",
				"to-[#f0c996]",
			)}
			lang="en"
		>
			<head></head>
			<body className="min-h-screen overflow-hidden text-lg">
				{children}
				<Analytics />
			</body>
		</html>
	)
}

export default RootLayout
