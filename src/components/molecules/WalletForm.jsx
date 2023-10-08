import { useWallet } from '@solana/wallet-adapter-react'
import clx from 'classnames'
import { useEffect, useRef, useState } from 'react'
import {
  IoCloseCircleOutline,
  IoFlameOutline,
  IoSearchOutline,
} from 'react-icons/io5'

import { Button } from '@/components/atoms'
import { WalletButton } from '@/components/molecules/WalletButton'
import { isSolanaAddress, isSolanaDomain } from '@/utils'

const AddressInput = ({ setValue, value }) => {
  const [isInputFocused, setIsInputFocused] = useState(false)

  const inputRef = useRef(null)
  const handleClearClick = (ev) => setValue('')
  const handleInputBlur = () => setIsInputFocused(false)
  const handleInputChange = (ev) => {
    const val = ev.target.value.trim()
    setValue(val)
  }
  const handleInputFocus = () => setIsInputFocused(true)
  const handleInputPasteClick = async () => {
    inputRef.current.focus()
    setValue(await navigator.clipboard?.readText())
  }
  const handleInputWrapperClick = () => inputRef.current.focus()

  return (
    <div
      className={clx(
        'order-2 sm:col-span-2 flex items-stretch p-1 rounded-lg bg-white shadow-md',
        { 'outline outline-2 outline-solana-purple': isInputFocused }
      )}
    >
      <span className="flex items-center pl-2" onClick={handleInputWrapperClick}>
        <IoSearchOutline size={24} />
      </span>
      <input
        ref={inputRef}
        value={value}
        className="grow min-w-0 px-2 bg-transparent !outline-none"
        placeholder="Solana Address or Domain"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      <Button unstyled className="mr-1 px-2 rounded-lg" onClick={handleClearClick}>
        <IoCloseCircleOutline size={24} />
      </Button>
      <Button onClick={handleInputPasteClick}>Paste</Button>
    </div>
  )
}

const WalletForm = ({ setAddress }) => {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)
  const { publicKey, disconnect: disconnectWallet } = useWallet()

  useEffect(() => {
    setIsValid(isSolanaAddress(value) || isSolanaDomain(value))
  }, [value])

  const handleFormSubmit = async (ev) => {
    ev.preventDefault()
    if (isValid) setAddress(value)
  }

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toString())
      disconnectWallet()
    }
  }, [disconnectWallet, publicKey, setAddress])

  return (
    <form className="max-w-md px-2 grid grid-cols-1 sm:grid-cols-2 gap-2" onSubmit={handleFormSubmit}>
      <AddressInput setValue={setValue} value={value} />
      <div className="order-2 text-center">OR</div>
      <div className="hidden sm:block order-2"></div>
      <div className="order-2">
        <WalletButton />
      <div className="text-center text-sm">No TX signing necessary</div>
      </div>
      <div className="order-2">
        <Button color="primary" disabled={!isValid} full type="submit">
          <IoFlameOutline size={24} />
          <span>Let&apos;s Go!</span>
        </Button>
      </div>
      <div className="order-1 sm:order-3 sm:col-span-2 mb-2 sm:mb-0 sm:mt-2 text-2xl text-center">
        Check how much a Solana wallet has spent on transaction fees.
      </div>
    </form>
  )
}

export {
  WalletForm,
}
