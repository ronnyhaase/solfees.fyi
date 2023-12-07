const NumberDisplay = ({ as: Tag = "span", className, val }) => {
	const displayValue = new Intl.NumberFormat(
		navigator.language || navigator.userLanguage,
		{
			minimumFractionDigits: 0,
			maximumFractionDigit: 9,
			roundingPriority: "morePrecision",
		},
	).format(val)
	return <Tag className={className}>{displayValue}</Tag>
}

export { NumberDisplay as Number }
