const isSolanaAddress = value => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

const isSolanaDomain = value => /^.+\..+$/i.test(value)

export {
  isSolanaAddress,
  isSolanaDomain,
}
