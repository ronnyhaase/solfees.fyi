const isFunction = (value) => typeof value === "function"

const isSolanaAddress = (value) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const isSolanaDomain = (value) => /^.+\..+$/i.test(value)

const oneOf = (value, list) => list.length === 0 || list.includes(value)

export { isFunction, isSolanaAddress, isSolanaDomain, oneOf }
