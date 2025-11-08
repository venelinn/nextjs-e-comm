import gsap from "gsap"
import { useEffect, useRef } from "react"
import type { HeadingProps } from "../Headings"
import { Section } from "../Section"
import styles from "./Band.module.scss"
import { Member, type MemberData } from "./Variants/Member"

export interface BandProps {
	heading?: HeadingProps
	items?: MemberData[] // optional
}

export const Band = ({ heading, items = [] }: BandProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!containerRef.current || items.length === 0) return

		const members = Array.from(
			containerRef.current.querySelectorAll<HTMLElement>("[data-anim-item]"),
		)

		gsap.fromTo(
			members,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				stagger: 0.1,
				delay: 1.5,
				duration: 0.6,
				ease: "power4.out",
			},
		)
	}, [items])

	if (items.length === 0) return null // optional: don't render section if no members

	return (
		<Section
			classNames={{ main: styles.main }}
			heading={heading}
			size="full"
			animationID="gallery-grid"
		>
			<div data-anim="brands">
				<div className={styles.band} ref={containerRef}>
					{items.map((item, index) => (
						<Member key={index} data-anim-item data={item} tabIndex={index} />
					))}
				</div>
			</div>
		</Section>
	)
}

export default Band
