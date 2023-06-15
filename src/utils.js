const isSolanaAddress = value => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)

export {
  isSolanaAddress,
}
