import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"
import type { AppProps } from "next/app" // <- Import Next.js types
import { useRouter } from "next/router"
import { useEffect } from "react"
import { NavigationContextProvider } from "../context/navigationContext"
import { TransitionContextProvider } from "../context/transitionContext"
import useNextCssRemovalPrevention from "../hooks/useNextCssRemovalPrevention"
import { DataProvider } from "../utils/DataProvider"

import "@/styles/globals.scss"

gsap.registerPlugin(ScrollTrigger)

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const currentLanguageCode = router.locale

	/* Removes focus from next/link element after page change */
	useEffect(() => {
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur()
		}
	}, [router])

	/* Update HTML lang attribute */
	useEffect(() => {
		if (currentLanguageCode) {
			document.documentElement.lang = currentLanguageCode
		}
	}, [currentLanguageCode])

	/* Temporary fix to avoid flash of unstyled content (FOUC) during route transitions */
	useNextCssRemovalPrevention()

	return (
		<TransitionContextProvider>
			<NavigationContextProvider>
				<DataProvider>
					<Component {...pageProps} />
				</DataProvider>
			</NavigationContextProvider>
		</TransitionContextProvider>
	)
}
