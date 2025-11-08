import gsap from "gsap";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import useReduceMotion from "../../hooks/useReduceMotion";
import { getOptimizedImage } from "../../utils/common";
import { Section } from "../Section";
import styles from "./Hero.module.scss";

type Maybe<T> = T | undefined | null;

export interface HeroProps {
  images?: any[];
  content?: React.ReactNode;
  description?: React.ReactNode;
  animationID?: string;
  height?: string | number;
  id?: string;
  locale?: string;
}

const heroAnimation = (animationID: string) => {
  const timeline = gsap.timeline();
  const section = `[data-anim="${animationID}"]`;
  const sectionSelector = `[data-anim="${animationID}"] [data-anim="section-img-wrap"]`;
  const heroContentSelector = `[data-anim="${animationID}"] [data-anim="hero-content"]`;
  const heroImage = `[data-anim="${animationID}"] [data-anim="hero-image"]`;

  // Set the initial tilt
  gsap.set(heroImage, {
    yPercent: -4,
    rotateX: 20,
    transformOrigin: "center bottom",
  });

  timeline
    .from(sectionSelector, {
      duration: 1.5,
      opacity: 0,
      delay: 0.5,
      scale: 1.1,
      ease: "power4.out",
    })
    .from("header", { opacity: 0, duration: 1, delay: 1 }, "-=1")
    .from(
      heroContentSelector,
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=0.5",
    )
    .from(
      heroImage,
      {
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      },
      "-=0.5",
    );

  gsap.to(heroImage, {
    yPercent: 0,
    rotateX: 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom 50%",
      scrub: 1,
    },
  });
};

// Section is implemented in JS and doesn't export TS props; cast to permissive type
const SectionAny = Section as unknown as React.FC<any>;

const Hero: React.FC<HeroProps> = ({ images, content, description, animationID = "undefined", height }) => {
  const reduceMotion = useReduceMotion();

  // safely read nested image fields and only compute optimized values
  const image = images?.[0]?.image?.[0];
  let url: Maybe<string>;
  let width: Maybe<number>;
  let fixedHeight: Maybe<number>;
  if (image) {
    const optimized = getOptimizedImage(image, 1600, "100");
    url = optimized?.url;
    width = optimized?.width;
    fixedHeight = optimized?.height;
  }

  const heroRef = useRef<any>(null);
  const imageRef = useRef<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduceMotion && animationID) {
        heroAnimation(animationID);
      }
    });
    return () => ctx.revert();
  }, [reduceMotion, animationID, url]);

  return (
    <SectionAny
      animationID={animationID}
      height={height}
      theme="dark"
      ref={heroRef}
      classNames={{
        main: styles.main,
        inner: styles.inner,
        heading: styles.heading,
      }}
    >
      <div className={styles.hero__content} data-anim="hero-content">
        {content && <div className={styles.hero__title}>{content}</div>}
        {description && <p>{description}</p>}
      </div>

      {url && (
        <div className={styles.hero__image__wrap}>
          <div className={styles.hero__image} ref={imageRef} data-anim="hero-image">
            <Image
              src={url}
              alt={image?.alt || ""}
              width={width || 1600}
              height={fixedHeight || 1600}
              priority={true}
              unoptimized={false}
            />
          </div>
        </div>
      )}
    </SectionAny>
  );
};

export default Hero;
export { Hero, heroAnimation };
