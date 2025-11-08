import { ImageContent } from "./ImageContent";

const ImageContentConnector = (props) => {
	return (
		<ImageContent
			animationID={props?.animationID}
			subHeading={props?.subHeading}
			heading={props?.heading}
			theme={props?.theme?.color}
			image={props?.image[0]}
			content={props?.content}
			isolation={props?.isolation}
			fullHeight={props?.fullHeight}
			id={props?.id}
			isContentFirst={props?.isContentFirst}
		/>
	);
};

export default ImageContentConnector;
export { ImageContentConnector };
