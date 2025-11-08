import { Generic } from "@/components/Generic";

const GenericConnector = (props) => {
	return (
		<Generic
			heading={props?.heading}
			pageName={props?.pageName}
			content={props?.content}
		/>
	);
};

export default GenericConnector;
export { GenericConnector };
