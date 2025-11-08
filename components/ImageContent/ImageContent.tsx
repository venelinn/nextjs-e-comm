import cx from "clsx";
import gsap from "gsap";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import { getOptimizedImage } from "../../utils/common";
import { renderRichTextContent } from "../../utils/RichText";
import { Heading } from "../Headings";
import { Section } from "../Section";
import styles from "./ImageContent.module.scss";

type HeadingLike = {
	heading?: React.ReactNode;
	as?: any;
	size?: any;
};

const ContentSection: React.FC<{
	content?: any;
	innerRef?: React.Ref<HTMLDivElement>;
	heading?: HeadingLike;
}> = ({ content, innerRef, heading }) => (
	<div
		ref={innerRef as any}
		data-anim="content-image"
		className={styles.module__content}
	>
		{heading?.heading && (
			<Heading
				as={heading?.as}
				size={heading?.size}
				className={styles.module__heading}
			>
				{heading?.heading}
			</Heading>
		)}
		{renderRichTextContent(content)}
	</div>
);

const ImageSection: React.FC<{
	image: any;
	innerRef?: React.Ref<HTMLDivElement>;
	fullHeight?: boolean;
}> = ({ image, innerRef, fullHeight }) => {
	const imageAspectRatio =
		image?.width && image?.height ? image.width / image.height : 1;
	const imageWidth = fullHeight ? 1600 : 800;
	const optimized = getOptimizedImage(image, imageWidth, "100");
	const { url, width, height } = optimized || {
		url: image?.src,
		width: image?.width || imageWidth,
		height: image?.height || imageWidth,
	};
	return (
		<div
			ref={innerRef as any}
			className={styles.module__image}
			data-orientation={imageAspectRatio > 1 ? "horizontal" : "vertical"}
			data-anim="cover-image"
		>
			<Image src={url} alt={image?.alt || ""} width={width} height={height} />
		</div>
	);
};

export const ImageContent: React.FC<{
	heading?: HeadingLike;
	subHeading?: any;
	animationID?: string;
	theme?: string;
	image?: any;
	content?: any;
	fullHeight?: boolean;
	isolation?: boolean;
	isContentFirst?: boolean;
	id?: string;
}> = ({
	heading,
	subHeading,
	animationID,
	theme,
	image,
	content,
	fullHeight,
	isolation,
	isContentFirst,
	id,
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (containerRef.current) {
			const elements = Array.from(
				containerRef.current.querySelectorAll("[data-anim]"),
			);
			gsap.fromTo(
				elements,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.2,
					duration: 0.7,
					delay: 1,
					ease: "power4.out",
				},
			);
		}
	}, []);

	const order = isContentFirst ? "content" : "image";
	return (
		<Section
			animationID={animationID}
			height={fullHeight ? "full" : undefined}
			id={id}
		>
			<div
				className={cx(
					styles.module,
					fullHeight && styles["module--full-height"],
				)}
				data-order={order}
				ref={containerRef}
			>
				{isContentFirst ? (
					<>
						<ContentSection content={content} heading={heading} />
						{image && <ImageSection image={image} fullHeight={fullHeight} />}
					</>
				) : (
					<>
						{image && <ImageSection image={image} fullHeight={fullHeight} />}
						<ContentSection content={content} heading={heading} />
					</>
				)}
			</div>
		</Section>
	);
};

export default ImageContent;
