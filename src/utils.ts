const isFunction = (value: unknown): boolean => typeof value === "function"

const isSolanaAddress = (value: string): boolean =>
	/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const isSolanaDomain = (value: string): boolean => /^.+\..+$/i.test(value)

/** Tests if value is one of the values within list */
const oneOf = (value: unknown, list: unknown[]): boolean =>
	list.length === 0 || list.includes(value)

export { isFunction, isSolanaAddress, isSolanaDomain, oneOf }
