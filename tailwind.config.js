const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '0.5rem',
    },
    extend: {
      colors: {
        'solana': '#9945FF',
      },
      fontFamily: {
        'sans': ['Noto Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
