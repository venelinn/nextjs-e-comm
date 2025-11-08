import cx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useNavigationContext from "../../context/navigationContext";
import useElementSize from "../../hooks/useElementSize";
import Button from "../Button/Button";
// import useWindowSize from "../../hooks/useWindowSize";
import Logo from "../Icons/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./Navigation.module.scss";

type NavLink = {
	slug: string;
	target?: string;
	pageName?: string;
	[key: string]: any;
};

type NavigationProps = {
	pageLocale: string;
	siteConfig?: any;
	links: NavLink[];
	isNavigationVisible?: boolean;
	isLogoVisible?: boolean;
};

function Hamburger({
	isOpen,
	toggle,
}: {
	isOpen?: boolean;
	toggle?: () => void;
}) {
	return (
		<button
			className={cx(styles.hamburger, {
				[styles["is-nav-active"]]: isOpen,
			})}
			type="button"
			aria-label="Toggle menu"
			onClick={toggle}
		>
			<div className={styles.hamburger__lines}>
				<span></span>
			</div>
		</button>
	);
}

const Navigation = ({
	pageLocale,
	siteConfig,
	links,
	isNavigationVisible,
	isLogoVisible,
}: NavigationProps) => {
	// useNavigationContext is a JS module; cast to any for now
	const { setRef, sticky, stuck, fixed, isOpen, toggle } =
		(useNavigationContext() as any) || {};
	// useElementSize returns [refSetter, { height }]
	const [navigationRef, { height }]: any = useElementSize() as any;
	const router = useRouter();
	// const { isMobile, isDesktop } = useWindowSize() as any;
	const headerText = siteConfig?.headerText;

	const locale = pageLocale.split("-")[0];
	useEffect(() => {
		if (fixed) {
			document.body.classList.add(styles.fixedNav);
		} else {
			document.body.classList.remove(styles.fixedNav);
		}

		return () => {
			document.body.classList.remove(styles.fixedNav);
		};
	}, [fixed]);

	function getCloudinaryAsSvg(url: string) {
		if (url.includes(".svg")) {
			return url.replace("/f_auto", "");
		}
		return url;
	}

	return (
		<>
			<style jsx global>{`
        :root {
          --navigation-height: ${height}px;
        }
      `}</style>
			<header
				data-header
				className={cx(styles.navigation, {
					[styles["is-stuck"]]: sticky,
					[styles["is-open"]]: isOpen,
					[styles["is-fixed"]]: fixed,
					[styles["is-stuck"]]: stuck,
					[styles["logo-hidden"]]: isLogoVisible === false,
				})}
				ref={(el) => {
					navigationRef?.(el);
					setRef?.(el);
				}}
			>
				<div
					className={styles.navigation__inner}
					data-anim="navigation"
					data-is-nav-visible={isNavigationVisible}
				>
					<div
						className={cx(styles.navigation__logo, {
							[styles["with-nav"]]: isNavigationVisible !== false,
						})}
					>
						{headerText && (
							<Link href="/" locale={pageLocale} className={styles.logo}>
								<Logo />
							</Link>
						)}
					</div>
					<div className={styles.navigation__menu}>
						{isNavigationVisible !== false && (
							<div className={styles["navigation__menu-list"]}>
								{links.map((link) => {
									const isActive =
										link.slug === "/"
											? router.asPath === "/"
											: router.asPath.startsWith(link.slug);
									return (
										<Link
											key={link.slug}
											href={link.slug}
											target={link?.target}
											locale={locale}
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
						{siteConfig?.requestQuote && (
							<Button
								variant="primary"
								outlined
								href={siteConfig?.requestQuote.url}
								label={siteConfig?.requestQuote.name}
							/>
						)}
						<LocaleSwitcher pageLocale={pageLocale} isOpen={isOpen} />
					</div>

					{isNavigationVisible !== false && (
						<Hamburger isOpen={isOpen} toggle={toggle} />
					)}
				</div>
			</header>
		</>
	);
};

export default Navigation;
export { Navigation };
