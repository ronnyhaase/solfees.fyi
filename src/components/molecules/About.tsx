import clx from "classnames"
import Image from "next/image"

const About: React.FC<{ className?: string }> = ({ className }) => (
	<div className={clx(className, "text-sm")}>
		<p className="mb-2 flex flex-col text-center">
			<span>This useless tool was built by your favorite Solana fren,</span>
			<span>
				<a href="https://twitter.com/ronnyhaase">
					<Image
						alt="Ronny Haase PFP"
						className="inline"
						height={128}
						priority
						src="/ronnyhaase.png"
						width={128}
					/>
				</a>
			</span>
			<span>
				&copy; <a href="https://twitter.com/ronnyhaase">Ronny Haase</a>, 2023
			</span>
		</p>
		<p className="mb-2">
			It is free software under{" "}
			<a href="https://www.gnu.org/licenses/gpl-3.0">
				GNU General Public License version 3
			</a>{" "}
			and you&apos;re invited{" "}
			<a href="https://github.com/ronnyhaase/solfees.fyi">to contribute</a>.
			<br />
			This program comes with ABSOLUTELY NO WARRANTY.
		</p>
	</div>
)

export { About }
