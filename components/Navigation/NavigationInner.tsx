"use client";

import cx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogoutButton } from "@/components/Auth/logout-button";
// ecommerce
import { CartIcon } from "@/components/Ecommerce/cartIcon";
import useNavigationContext from "../../context/navigationContext";
import useElementSize from "../../hooks/useElementSize";
import Button from "../Button/Button";
import { Hamburger } from "./Hamburger";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./Navigation.module.scss";

type NavLink = {
  slug: string;
  target?: string;
  pageName?: string;
};

type NavigationInnerProps = {
  pageLocale: string;
  siteConfig?: any;
  links: NavLink[];
  isNavigationVisible?: boolean;
  isLogin?: any;
};

export function NavigationInner({ pageLocale, siteConfig, links, isNavigationVisible, isLogin }: NavigationInnerProps) {
  const { setRef, sticky, stuck, fixed, isOpen, toggle } = (useNavigationContext() as any) || {};
  const [navigationRef, { height }]: any = useElementSize() as any;
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.toggle(styles.fixedNav, fixed);
    return () => document.body.classList.remove(styles.fixedNav);
  }, [fixed]);

  return (
    <>
      <style jsx global>{`
        :root {
          --navigation-height: ${height}px;
        }
      `}</style>

      <div
        className={cx(styles.navigation__menu, {
          [styles["is-stuck"]]: sticky,
          [styles["is-open"]]: isOpen,
          [styles["is-fixed"]]: fixed,
          [styles["is-stuck"]]: stuck,
        })}
        ref={(el) => {
          navigationRef?.(el);
          setRef?.(el);
        }}
      >
        {isNavigationVisible !== false && (
          <div className={styles["navigation__menu-list"]}>
            {links.map((link) => {
              const isActive = link.slug === "/" ? pathname === "/" : pathname?.startsWith(link.slug);
              return (
                <Link
                  key={link.slug}
                  href={link.slug}
                  target={link?.target}
                  className={cx(styles.link, {
                    [styles.link__active]: isActive,
                  })}
                >
                  {link.pageName}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className={styles.navigation__social}>
        <CartIcon url="/cart" />
        {isLogin ? (
          <LogoutButton />
        ) : (
          <>
            <Button href="/auth/login" size="sm" variant="primary" label="Sign in" />
            <Button href="/auth/sign-up" size="sm" variant="primary" outlined label="Sign up" />
          </>
        )}
        <LocaleSwitcher pageLocale={pageLocale} isOpen={isOpen} />
      </div>

      {isNavigationVisible !== false && <Hamburger isOpen={isOpen} toggle={toggle} />}
    </>
  );
}
