// contentfulRichTextRenderer.js

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import React from "react";
import { Heading } from "../components/Headings";

// Utility function to adjust Cloudinary URLs
function getCloudinaryImageURL(url) {
	if (url.includes(".svg")) {
		return url.replace("/f_auto", "");
	}
	return url;
}

// Use your `getCloudinaryImageURL` function to preprocess Cloudinary URLs
export const renderEmbeddedEntryBlock = (node) => {
	const heading = node.data.target.fields;
	const seoHeading = heading?.isHidden;
	// Render the Heading component with dynamic props
	return (
		<Heading
			as={heading?.as}
			size={heading?.size}
			uppercase={heading?.uppercase}
			alignment={heading?.alignment}
			animationID={heading?.animationID}
			highlight={heading?.highlight}
			isHidden={heading?.isHidden}
		>
			{seoHeading ? (
				<span className="sr-only">{heading?.heading}</span>
			) : (
				heading?.heading
			)}
		</Heading>
	);
};

// Function to render embedded assets like images
export const renderEmbeddedAssetBlock = (node) => {
	const asset = node.data.target.fields;

	return (
		<Image
			src={getCloudinaryImageURL(asset.image[0].url)}
			alt={asset.alt}
			width={asset.image[0].width}
			height={asset.image[0].height}
			// priority
		/>
	);
};
// Main function to render rich text content
export const renderRichTextContent = (content) => {
	const richTextOptions = {
		renderNode: {
			"embedded-entry-block": (node) => {
				// Check if the entry is a Heading or Button and render accordingly
				if (node.data.target.sys.contentType.sys.id === "heading") {
					return renderEmbeddedEntryBlock(node);
				} else if (
					node.data.target.sys.contentType.sys.id === "cloudinaryAsset"
				) {
					return renderEmbeddedAssetBlock(node);
				} else if (node.data.target.sys.contentType.sys.id === "button") {
					return renderButton(node);
				}
				return null;
			},
			// "embedded-entry-block": renderEmbeddedEntryBlock, // Apply custom rendering for embedded entries
			hyperlink: (node, children) => {
				const url = node.data.uri;
				const isExternalLink = url.startsWith("http");

				return (
					<a
						href={url}
						className={`link link--active ${isExternalLink ? "external-link" : ""}`}
						target={isExternalLink ? "_blank" : "_self"}
						rel={isExternalLink ? "noopener noreferrer" : ""}
					>
						<span className="link__text">{children}</span>
					</a>
				);
			},
		},
	};

	return documentToReactComponents(content, richTextOptions);
};
