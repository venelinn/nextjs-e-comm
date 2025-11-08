import Image from "next/image";
import { getOptimizedImage } from "../../utils/common";
import { renderRichTextContent } from "../../utils/RichText";
import { Heading } from "../Headings";
import styles from "./PrimaryCard.module.scss";

export type PrimaryCardImage = {
	src?: string;
	width?: number;
	height?: number;
	alt?: string;
};

export type PrimaryCardProps = {
	id?: string;
	heading?: any;
	locale?: string;
	content?: React.ReactNode;
	image?: PrimaryCardImage | null;
};

const PrimaryCard = ({ heading, locale, content, image }: PrimaryCardProps) => {
	const optimized = image ? getOptimizedImage(image, 800, "100") : null;
	const url = optimized?.url ?? image?.src ?? "";
	const width = optimized?.width ?? undefined;
	const height = optimized?.height ?? undefined;

	return (
		<div className={styles.card}>
			{image ? (
				<Image src={url} alt={image?.alt ?? ""} width={width} height={height} />
			) : null}
			<div className={styles.card__content}>
				{heading?.heading && (
					<Heading
						as={heading?.as}
						size={heading?.size}
						className={styles.module__heading}
					>
						{heading?.heading}
					</Heading>
				)}
				{content && renderRichTextContent(content)}
			</div>
		</div>
	);
};

export default PrimaryCard;
export { PrimaryCard };
