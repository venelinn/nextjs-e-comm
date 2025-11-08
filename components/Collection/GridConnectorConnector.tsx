import { PrimaryCard } from "../Cards";
import { GridCollection } from "./GridCollection";

const GridCollectionConnector = (props) => {
	const cards = (props.cards || props?.members) ?? [];
	if (!cards.length) return null;

	return (
		<GridCollection
			id={props.id}
			heading={props?.heading}
			description={props?.description}
			itemsPerRow={props.itemsPerRow}
			cardsWidth={props.cardsWidth}
			items={cards.map((item) => ({
				id: item.id,
				content: (
					<PrimaryCard
						image={item.image.image[0]}
						content={item.content}
						heading={item.heading}
						locale={props.locale}
					/>
				),
			}))}
		/>
	);
};

export { GridCollectionConnector };
