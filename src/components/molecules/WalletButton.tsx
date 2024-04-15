import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useCallback } from "react"
import { IoWalletOutline } from "react-icons/io5"

import { Button } from "../atoms"

const WalletButton: React.FC = ({}) => {
	const { setVisible: setModalVisible } = useWalletModal()
	const { buttonState, onConnect } = useWalletMultiButton({
		onSelectWallet() {
			setModalVisible(true)
		},
	})

	const handleClick = useCallback(() => {
		switch (buttonState) {
			case "no-wallet":
				setModalVisible(true)
				break
			case "has-wallet":
				if (onConnect) onConnect()
				break
			case "connected":
				break
		}
	}, [buttonState, onConnect, setModalVisible])

	return (
		<>
			<Button
				full
				disabled={
					buttonState === "connecting" || buttonState === "disconnecting"
				}
				onClick={handleClick}
			>
				<IoWalletOutline size={24} />
				<span>Connect Wallet</span>
			</Button>
		</>
	)
}

export { WalletButton }
