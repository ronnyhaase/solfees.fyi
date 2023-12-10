const DateDisplay = ({ as: Tag = "span", className, val }) => {
	const displayValue = new Intl.DateTimeFormat(
		navigator.language || navigator.userLanguage,
		{
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			weekday: "long",
		},
	).format(val)
	return <Tag className={className}>{displayValue}</Tag>
}

export { DateDisplay }
