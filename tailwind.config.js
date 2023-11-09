const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "0.5rem",
		},
		extend: {
			animation: {
				zoom: "zoom 1.5s infinite ease-in-out",
			},
			keyframes: {
				zoom: {
					"0%, 100%": { transform: "scale(0.0 )" },
					"50%": { transform: "scale(1.0 )" },
				},
			},
			colors: {
				primary: colors.purple["600"],
				secondary: colors.slate["700"],
				"solana-green": "#14F195",
				"solana-purple": "#9945FF",
			},
			fontFamily: {
				sans: ["var(--font-notosans)", ...defaultTheme.fontFamily.sans],
			},
			transitionDelay: {
				250: "250ms",
			},
		},
	},
	plugins: [require("./src/tw-plugins/animation-delay")],
}
