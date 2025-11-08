import cx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import useReduceMotion from "../../hooks/useReduceMotion";
import { Section } from "../Section";
import styles from "./Footer.module.scss";

type FooterLink = {
  slug: string;
  pageName: string;
};

type SiteConfig = {
  copyright?: string;
  fineprint?: string;
  [key: string]: any;
};

type FooterProps = {
  siteConfig?: SiteConfig;
  links?: FooterLink[];
  pageLocale: string;
};

export default function Footer({ siteConfig, links = [], pageLocale }: FooterProps) {
  const reduceMotion = useReduceMotion();
  const router = useRouter();
  const element = useRef<HTMLDivElement | null>(null);
  const locale = pageLocale?.split("-")[0] ?? "en";

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduceMotion && element.current) {
        const opts: any = {
          opacity: 0,
          delay: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element.current,
            start: "-100% bottom",
            end: "top top",
          },
        };
        gsap.from(element.current as any, opts);
      }
    }, element);
    return () => ctx.revert();
  }, [router.asPath, reduceMotion]);

  return (
    <Section
      classNames={{
        main: styles.main,
      }}
    >
      <div className={styles.footer} ref={element}>
        <div className={styles.footer__fineprint}>
          <span>
            &copy; {new Date().getFullYear()} {siteConfig?.copyright} {siteConfig?.fineprint}
          </span>
        </div>
        {Array.isArray(links) && links.length > 0 && (
          <div className={styles.footer__nav}>
            {links.map((link) => {
              const isActive = router.asPath === link.slug;
              return (
                <Link
                  key={link.slug}
                  href={link.slug}
                  locale={locale}
                  className={cx("link", styles.link, {
                    ["link--active"]: isActive,
                    [styles.link__active]: isActive,
                  })}
                >
                  <span className="link__text">{link.pageName}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
