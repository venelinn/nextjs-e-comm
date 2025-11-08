import React from "react";
import { renderRichTextContent } from "../../utils/RichText";
import { Section, type SectionHeading } from "../Section";
import styles from "./Generic.module.scss";

type GenericProps = {
	heading?: SectionHeading | null;
	pageName?: string;
	content?: any;
};

const Generic = ({ heading, pageName, content }: GenericProps) => {
	const pageHeading =
		heading ||
		({
			heading: pageName,
			as: "h1",
			size: "h1",
		} as SectionHeading);

	return (
		<Section
			heading={pageHeading}
			classNames={{
				main: styles.main,
			}}
		>
			{content && (
				<div className={styles.generic}>
					<div className={styles.generic__body}>
						{renderRichTextContent(content)}
					</div>
				</div>
			)}
		</Section>
	);
};

export default Generic;
export { Generic };
