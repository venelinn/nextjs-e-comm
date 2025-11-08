import cx from "clsx";
import gsap from "gsap";
import Image from "next/image";
import type React from "react";
import { forwardRef, useEffect, useRef } from "react";
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

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  (
    {
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
    }: SectionProps,
    ref,
  ) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!sectionRef.current || !animationID) return;

      const timeline: any = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      timeline
        .from(
          `[data-anim=${animationID}] [data-anim='section-title']`,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power4.out",
          },
          0,
        )
        .from(
          `[data-anim=${animationID}] [data-anim='section-img']`,
          {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: "power4.out",
          },
          0.3,
        )
        .from(
          `[data-anim=${animationID}] .${styles.section__inner}`,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power4.out",
          },
          0.6,
        );

      return () => {
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill();
        }
        timeline.kill();
      };
    }, [animationID]);

    const classes = cx(styles.section, classNames?.main, className, {
      [styles["section--full-width"]]: size === "full",
      [styles["section--full-height"]]: Boolean(height),
      rel: Boolean(image),
    });

    // Keep forwarding the ref to the section DOM node
    const setRef = (el: HTMLDivElement | null) => {
      sectionRef.current = el;
      if (!ref) return;
      if (typeof ref === "function") {
        try {
          ref(el);
        } catch (e) {
          // ignore
        }
      } else {
        (ref as React.MutableRefObject<any>).current = el;
      }
    };

    return (
      <section
        id={id}
        className={classes}
        data-anim={animationID || undefined}
        ref={setRef}
        data-full={height}
        {...props}
      >
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
  },
);

// Named export already defined above via `export const Section = ...`.
