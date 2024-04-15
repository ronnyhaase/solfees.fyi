import {
	Transition,
	type TransitionClasses,
	type TransitionEvents,
} from "@headlessui/react"
import { type ReactNode } from "react"

type FadeInOutTransitionProps = TransitionClasses &
	TransitionEvents & {
		appear?: boolean
		children: ReactNode
		show?: boolean
	}

const FadeInOutTransition: React.FC<FadeInOutTransitionProps> = ({
	children,
	...rest
}) => (
	<Transition
		enter="duration-200 ease-in transition-opacity"
		enterFrom="opacity-0"
		enterTo="opacity-100"
		leave="duration-200 ease-out transition-opacity"
		leaveFrom="opacity-100"
		leaveTo="opacity-0"
		{...rest}
	>
		{children}
	</Transition>
)

export { FadeInOutTransition }
