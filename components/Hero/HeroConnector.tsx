import { renderRichTextContent } from "../../utils/RichText";
import { Hero } from "./Hero";

const HeroConnector = (props) => {
	return (
		<Hero
			id={props?.id}
			images={props?.images}
			locale={props?.locale}
			animationID={props?.animationID}
			content={renderRichTextContent(props?.content)}
			description={props?.description}
			height={props?.height}
		/>
	);
};

export default HeroConnector;
export { HeroConnector };
