import clx from "classnames"
import PlausibleProvider from "next-plausible"
import { Noto_Sans } from "next/font/google"
import { type ReactNode } from "react"

require("./styles.css")

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
			<head>
				<PlausibleProvider domain="solfees.fyi" trackOutboundLinks />
			</head>
			<body className="min-h-screen overflow-hidden text-lg">{children}</body>
		</html>
	)
}

export default RootLayout
