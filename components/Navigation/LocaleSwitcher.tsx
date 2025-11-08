"use client"
import cx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Globe from "@/components/Icons/Globe"
import localization from "@/utils/localization"
import styles from "./LocaleSwitcher.module.scss"

type LocaleSwitcherProps = {
	pageLocale: string
	isOpen?: boolean
}

export const LocaleSwitcher = ({ pageLocale, isOpen }: LocaleSwitcherProps) => {
	const router = useRouter()

	const onLanguageLinkClick = (locale: string) => {
		const { pathname, asPath, query } = router
		router.push({ pathname, query }, asPath, { locale })

		// Reset the langVisible state when a language link is clicked
		setLangVisible(false)
	}

	// TOGGLE
	const [langVisible, setLangVisible] = useState(false)
	const toggleLang = () => {
		setLangVisible(!langVisible)
	}

	// Close the menu when the router changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setLangVisible(false)
	}, [router.asPath])

	return (
		<div className={styles.languages}>
			<button
				type="button"
				className={`${langVisible || isOpen ? "hidden" : ""}`}
				onClick={toggleLang}
			>
				<Globe />
			</button>
			<div
				className={`${langVisible || isOpen ? "flex" : "hidden"} ${styles.lang}`}
			>
				{localization.locales.map((lang) => {
					const isActive = pageLocale === lang
					return (
						<Link
							href={router.asPath}
							locale={lang}
							key={lang}
							className={cx("link", styles.link, {
								["link--active"]: isActive,
								[styles.lang__active]: isActive,
							})}
							onClick={() => onLanguageLinkClick(lang)}
						>
							<span className="link__text">{lang}</span>
						</Link>
					)
				})}
			</div>
		</div>
	)
}

export default LocaleSwitcher
