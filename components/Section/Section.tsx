import cx from "clsx";
import Image from "next/image";
import type React from "react";
import { forwardRef } from "react";
import { renderRichTextContent } from "../../utils/RichText";
import { Heading } from "../Headings";
import styles from "./Section.module.scss";

export type SectionHeading = {
  heading?: React.ReactNode;
  as?: any;
  size?: any;
  uppercase?: boolean;
  center?: boolean;
  highlight?: boolean;
};

export type SectionClassNames = {
  main?: string;
  inner?: string;
  image?: string;
  imageImg?: string;
  heading?: string;
};

export type SectionImage = {
  src: string;
  alt?: string;
};

export type SectionProps = {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  classNames?: SectionClassNames;
  image?: SectionImage | undefined;
  animationID?: string | null;
  heading?: SectionHeading;
  size?: "fixed" | "full";
  height?: string | undefined;
  description?: string | undefined;
  imageAlignment?: "top" | "bottom" | undefined;
  [key: string]: any;
};

export const Section = ({
  id = "",
  children = null,
  className = "",
  classNames = {},
  image = undefined,
  animationID = null,
  heading = {},
  size = "fixed",
  height = undefined,
  description = undefined,
  imageAlignment = undefined,
  ...props
}: SectionProps) => {
  const classes = cx(styles.section, classNames?.main, className, {
    [styles["section--full-width"]]: size === "full",
    [styles["section--full-height"]]: Boolean(height),
    rel: Boolean(image),
  });

  return (
    <section id={id} className={classes} data-anim={animationID || undefined} data-full={height} {...props}>
      {image && (
        <div className={cx(styles.section__image, classNames?.image)} data-anim="section-img-wrap">
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            data-anim="section-img"
            className={cx(styles.section__image__img, classNames?.imageImg, {
              [styles[`hero-${imageAlignment}`]]: Boolean(imageAlignment),
            })}
          />
        </div>
      )}
      <div className={cx(styles.section__inner, classNames?.inner)}>
        {heading?.heading && description && (
          <div className={styles.section__header}>
            {heading?.heading && (
              <Heading
                as={heading?.as}
                size={heading?.size}
                uppercase={heading?.uppercase}
                animationID="section-title"
                center={heading?.center}
                highlight={heading?.highlight}
                className={cx(styles.section__heading, classNames?.heading)}
              >
                {heading?.heading}
              </Heading>
            )}
            {description && <div className={styles.section__description}>{renderRichTextContent(description)}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
