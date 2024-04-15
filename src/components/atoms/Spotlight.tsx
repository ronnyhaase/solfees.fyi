"use client"

import { useEffect, useRef, useState } from "react"

const Spotlight: React.FC<{ opacity: number; size: number }> = ({
	opacity = 0.2,
	size = 200,
}) => {
	const INTERVAL = 1500
	const SPEED = 0.2

	const [position, setPosition] = useState({
		x: Math.random() * (window.innerWidth - size),
		y: Math.random() * (window.innerHeight - size),
	})
	const [isMoving, setIsMoving] = useState(false)
	const spotlightRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const moveSpotlight = () => {
			const newX = Math.random() * (window.innerWidth - size)
			const newY = Math.random() * (window.innerHeight - size)

			setPosition({ x: newX, y: newY })
			setIsMoving(true)
		}

		const animationFrame = () => {
			if (isMoving && spotlightRef.current) {
				const currentX = parseFloat(spotlightRef.current.style.left || "0")
				const currentY = parseFloat(spotlightRef.current.style.top || "0")

				const deltaX = position.x - currentX
				const deltaY = position.y - currentY

				const speed = SPEED

				if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
					const newX = currentX + deltaX * speed
					const newY = currentY + deltaY * speed
					spotlightRef.current.style.left = newX + "px"
					spotlightRef.current.style.top = newY + "px"
					requestAnimationFrame(animationFrame)
				} else {
					setIsMoving(false)
				}
			}
		}

		const interval = setInterval(moveSpotlight, INTERVAL)

		// Start the animation
		animationFrame()

		return () => clearInterval(interval)
	}, [position, isMoving])

	return (
		<div
			ref={spotlightRef}
			style={{
				position: "fixed",
				width: `${size}px`,
				height: `${size}px`,
				left: position.x + "px",
				top: position.y + "px",
				backgroundColor: `rgba(255, 255, 255, ${opacity})`,
				borderRadius: "50%",
				transition: "left 1s ease, top 1s ease",
			}}
		></div>
	)
}

export { Spotlight }
