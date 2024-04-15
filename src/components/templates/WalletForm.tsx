import { useWallet } from "@solana/wallet-adapter-react"
import clx from "classnames"
import { usePlausible } from "next-plausible"
import {
	type ChangeEvent,
	type ClipboardEvent,
	type ClipboardEventHandler,
	type FormEvent,
	type SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react"
import {
	IoCloseCircleOutline,
	IoFlameOutline,
	IoSearchOutline,
} from "react-icons/io5"

import { Button } from "@/components/atoms"
import { WalletButton } from "@/components/molecules/WalletButton"
import { isFunction, isSolanaAddress, isSolanaDomain } from "@/utils"

type AddressInputProps = {
	setValue: (value: string) => void
	value: string
	onClearClick: (ev: SyntheticEvent) => void
	onPasteNative: ClipboardEventHandler
	onPasteClick: (ev: SyntheticEvent) => void
}

const AddressInput: React.FC<AddressInputProps> = ({
	setValue,
	value,
	onClearClick,
	onPasteNative,
	onPasteClick,
}) => {
	const [isInputFocused, setIsInputFocused] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)
	const handleClearClick = (ev: SyntheticEvent) => {
		setValue("")
		if (isFunction(onClearClick)) onClearClick(ev)
	}
	const handleInputBlur = () => setIsInputFocused(false)
	const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const val = ev.target.value.trim()
		setValue(val)
	}
	const handleInputFocus = () => setIsInputFocused(true)
	const handleInputPaste = (ev: ClipboardEvent<HTMLInputElement>) => {
		if (isFunction(onPasteNative)) onPasteNative(ev)
	}
	const handleInputPasteClick = async (ev: SyntheticEvent) => {
		if (isFunction(onPasteClick)) onPasteClick(ev)
		inputRef.current?.focus()
		setValue(await navigator.clipboard?.readText())
	}
	const handleInputWrapperClick = () => inputRef.current?.focus()

	return (
		<div
			className={clx(
				"order-2 sm:col-span-2 flex items-stretch p-1 rounded-lg bg-white shadow-md",
				{ "outline outline-2 outline-solana-purple": isInputFocused },
			)}
		>
			<span
				className="flex items-center pl-2"
				onClick={handleInputWrapperClick}
			>
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
				onPaste={handleInputPaste}
			/>
			<Button
				unstyled
				className="mr-1 px-2 rounded-lg"
				onClick={handleClearClick}
			>
				<IoCloseCircleOutline size={24} />
			</Button>
			<Button onClick={handleInputPasteClick}>Paste</Button>
		</div>
	)
}

type WalletFormProps = {
	reset: () => void
	setAddress: (address: string) => void
	wallets: number
}

const WalletForm: React.FC<WalletFormProps> = ({
	reset,
	setAddress,
	wallets,
}) => {
	const plausible = usePlausible()
	const [value, setValue] = useState("")
	const [isValid, setIsValid] = useState(true)
	const { publicKey, disconnect: disconnectWallet } = useWallet()

	useEffect(() => {
		setIsValid(isSolanaAddress(value) || isSolanaDomain(value))
	}, [value])

	const handleFormSubmit = async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault()
		if (isValid) {
			plausible("Submit", {
				props: { Type: isSolanaDomain(value) ? "Domain" : "Address" },
			})
			setAddress(value)
		}
	}

	useEffect(() => {
		if (publicKey) {
			plausible("Submit", { props: { Type: "Wallet Connect" } })
			setAddress(publicKey.toString())
			disconnectWallet()
		}
	}, [disconnectWallet, plausible, publicKey, setAddress])

	return (
		<form
			className="max-w-md px-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
			onSubmit={handleFormSubmit}
		>
			<AddressInput
				onClearClick={() => plausible("Clear click")}
				onPasteClick={() => plausible("Paste click")}
				onPasteNative={() => plausible("Paste native")}
				setValue={setValue}
				value={value}
			/>
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
				Check how much your Solana wallets have spent on transaction fees.
				<br />
				{wallets > 0 ? (
					<small className="leading-none text-[#475569]">
						You&apos;re adding another wallet...{" "}
						<Button
							unstyled
							className="pb-1 text-primary underline underline-offset-4"
							onClick={reset}
						>
							Start again
						</Button>{" "}
						instead
					</small>
				) : null}
			</div>
		</form>
	)
}

export { WalletForm }
