import gsap from "gsap";
import { type ReactNode, useEffect, useRef } from "react";
import { Cell, Row, type RowProps } from "../Grid";
import type { HeadingProps } from "../Headings/Heading";
import { Section } from "../Section";
import styles from "./GridCollection.module.scss";

export interface GridCollectionItem {
	id: string;
	content: ReactNode;
}
type GridCollectionProps = {
	id?: string;
	items: GridCollectionItem[];
	itemsPerRow?: RowProps["cols"];
	cardsWidth?: string;
	heading?: HeadingProps & { heading?: ReactNode; id?: string };
	description?: string;
};

const GridCollection = ({
	id,
	items,
	heading,
	description,
	itemsPerRow = 2,
	cardsWidth,
}: GridCollectionProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!containerRef.current) return;

		const cells = Array.from(
			containerRef.current.querySelectorAll<HTMLElement>("[data-anim-item]"),
		);

		gsap.fromTo(
			cells,
			{ opacity: 0, y: 20 }, // initial state
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				ease: "power4.out",
				scrollTrigger: {
					trigger: containerRef.current, // trigger the animation when the container enters the viewport
					start: "top 80%",
					toggleActions: "play none none none",
				},
			},
		);
	}, []);
	return (
		<>
			<Section
				id={id}
				className={styles.section}
				heading={heading}
				description={description}
				animationID="gallery-grid"
			/>
			<Section className={cardsWidth}>
				<Row cols={itemsPerRow} className={styles.wrapper} ref={containerRef}>
					{items.map((item) => (
						<Cell key={item.id} data-anim-item>
							{item.content}
						</Cell>
					))}
				</Row>
			</Section>
		</>
	);
};

export { GridCollection };
