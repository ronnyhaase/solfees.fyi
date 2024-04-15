import clx from "classnames"
import Image from "next/image"

const SunriseAd: React.FC<{ className: string }> = ({ className }) => (
	<a
		className={clx(
			className,
			"block max-w-xs mx-auto text-center text-base text-[#145D3E]",
		)}
		href="https://www.sunrisestake.com"
		target="_blank"
		referrerPolicy="origin"
	>
		If you like this tool, thank me by offsetting carbon emissions while you
		sleep, at
		<br />
		<Image
			alt="Sunrise Stake - Offset emissions while you sleep."
			className="inline max-w-[128px]"
			height={61}
			src="/sunrisestake.svg"
			width={128}
		/>
	</a>
)

export { SunriseAd }
