// components/Navigation/Navigation.tsx

import cx from "clsx";
import Link from "next/link";
import Logo from "@/components/Icons/Logo";
import { createClient } from "@/lib/supabase/server";
import styles from "./Navigation.module.scss";
import { NavigationInner } from "./NavigationInner";

type NavLink = {
  slug: string;
  target?: string;
  pageName?: string;
};

type NavigationProps = {
  pageLocale: string;
  siteConfig?: any;
  links: NavLink[];
  isNavigationVisible?: boolean;
  isLogoVisible?: boolean;
};

export default async function Navigation({
  pageLocale,
  siteConfig,
  links,
  isNavigationVisible,
  isLogoVisible,
}: NavigationProps) {
  const headerText = siteConfig?.headerText;
  // You can also use getUser() which will be slower.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  // const hasEnvVars = getEnvVarsStatus();
  console.log("siteConfig", siteConfig);

  return (
    <header
      data-header
      className={cx(styles.navigation, {
        [styles["logo-hidden"]]: isLogoVisible === false,
      })}
    >
      <div className={styles.navigation__inner} data-anim="navigation" data-is-nav-visible={isNavigationVisible}>
        <div
          className={cx(styles.navigation__logo, {
            [styles["with-nav"]]: isNavigationVisible !== false,
          })}
        >
          {headerText && (
            <Link href="/" className={styles.logo}>
              <Logo />
            </Link>
          )}
        </div>

        {/* ✅ Client interactivity in a separate component */}
        <NavigationInner
          pageLocale={pageLocale}
          siteConfig={siteConfig}
          links={links}
          isNavigationVisible={isNavigationVisible}
          isLogin={user}
        />
      </div>
    </header>
  );
}
