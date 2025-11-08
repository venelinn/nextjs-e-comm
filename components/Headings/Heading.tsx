import cx from "clsx";
import styles from "./Heading.module.scss";

interface HeadingProps {
	uppercase?: boolean;
	as?: HeadingTag;
	size?: HeadingSizeValue;
	className?: string;
	children?: React.ReactNode;
	center?: boolean;
	animationID?: string;
	highlight?: boolean;
	isHidden?: boolean;
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "div";

const HeadingAsElement: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5", "div"];

type HeadingSizeValue = HeadingTag | "hero" | "base";

const HeadingSizeRaw: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5"];
const HeadingSize: HeadingSizeValue[] = [...HeadingSizeRaw, "hero", "base"];

const Heading: React.FC<HeadingProps> = ({
	uppercase = false,
	as = "h2",
	size = "h2",
	className = undefined,
	children = undefined,
	center = false,
	animationID = undefined,
	highlight = false,
	isHidden = false,
	...props
}) => {
	const Tag = as as HeadingTag;
	const classes = cx(styles.heading, {
		[styles[`heading--${size}`]]: size,
		[styles["heading--uppercase"]]: uppercase,
		[styles["heading--center"]]: center,
		[styles["heading--highlight"]]: highlight,
		[`${className}`]: className,
	});
	return (
		<Tag
			className={classes}
			data-anim={animationID}
			style={
				highlight
					? ({
							"--heading-color": "var(--color-highlight)",
						} as React.CSSProperties)
					: undefined
			}
			{...props}
		>
			{children}
		</Tag>
	);
};

export default Heading;
export { Heading, HeadingAsElement, HeadingSize };
export type { HeadingProps };
