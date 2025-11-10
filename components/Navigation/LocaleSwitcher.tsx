"use client";

import cx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Globe from "@/components/Icons/Globe";
import { localization } from "@/utils/localization";
import styles from "./LocaleSwitcher.module.scss";

type LocaleSwitcherProps = {
  pageLocale: string;
  isOpen?: boolean;
};

export const LocaleSwitcher = ({ pageLocale, isOpen }: LocaleSwitcherProps) => {
  const pathname = usePathname(); // ✅ replaces router.asPath
  const [langVisible, setLangVisible] = useState(false);

  const toggleLang = () => setLangVisible(!langVisible);

  useEffect(() => {
    setLangVisible(false);
  }, [pathname]); // ✅ reacts to pathname changes

  return (
    <div className={styles.languages}>
      <button type="button" className={`${langVisible || isOpen ? "hidden" : ""}`} onClick={toggleLang}>
        <Globe />
      </button>

      <div className={`${langVisible || isOpen ? "flex" : "hidden"} ${styles.lang}`}>
        {localization.locales.map((lang) => {
          const isActive = pageLocale === lang;
          const safePath = pathname ?? "/";
          const newPath = `/${lang}${safePath.replace(/^\/[a-z]{2}(\/|$)/, "/")}`;

          // ^ this replaces the old /en/ prefix with the new lang

          return (
            <Link
              href={newPath}
              key={lang}
              className={cx("link", styles.link, {
                ["link--active"]: isActive,
                [styles.lang__active]: isActive,
              })}
              onClick={() => setLangVisible(false)}
            >
              <span className="link__text">{lang}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LocaleSwitcher;
