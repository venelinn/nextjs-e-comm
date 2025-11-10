"use client";
import cx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname(); // ✅ replaces router.asPath
  const locale = pageLocale?.split("-")[0] ?? "en";
  const footerText = siteConfig?.footer;

  return (
    <Section
      classNames={{
        main: styles.main,
      }}
    >
      <div className={styles.footer}>
        <div className={styles.footer__fineprint}>
          <span>
            &copy; {new Date().getFullYear()} {footerText?.copyright} {footerText?.fineprint}
          </span>
        </div>
        {Array.isArray(links) && links.length > 0 && (
          <div className={styles.footer__nav}>
            {links.map((link) => {
              const isActive = pathname === link.slug;
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
