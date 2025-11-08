import { useRouter } from "next/router"
import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import useLockedScroll from "../hooks/useLockedScroll"
import useScrollbar from "../hooks/useScrollbar"
import useWindowSize from "../hooks/useWindowSize"

// --- Context value type ---
type NavigationContextType = {
	ref: HTMLElement | null
	setRef: (el: HTMLElement | null) => void
	isOpen: boolean
	setIsOpen: (open: boolean) => void
	fixed: boolean
	sticky: boolean
	stuck: boolean
	toggle: () => void
}

// --- Create context ---
const NavigationContext = createContext<NavigationContextType>({
	ref: null,
	setRef: () => {},
	isOpen: false,
	setIsOpen: () => {},
	fixed: false,
	sticky: false,
	stuck: false,
	toggle: () => {},
})

// --- Provider props type ---
type NavigationContextProviderProps = {
	children: ReactNode
}

// --- Provider component ---
export function NavigationContextProvider({
	children,
}: NavigationContextProviderProps) {
	const [ref, setRef] = useState<HTMLElement | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const { scrollY } = useScrollbar()
	const { windowSize, isDesktop } = useWindowSize()
	const [locked, setLocked] = useLockedScroll(false)
	const router = useRouter()

	const navigationHeight = 100 // Height at which "stuck" triggers

	const [isSticky, setIsSticky] = useState(false)
	const [isStuck, setIsStuck] = useState(false)
	const [isFixedAlwaysTrue, setIsFixedAlwaysTrue] = useState(false)

	const toggle = () => {
		setIsOpen(!isOpen)
		setLocked(!locked)
	}

useEffect(() => {
  const handleScroll = () => {
    const isScrollPastNavigation = scrollY > navigationHeight;

    // Use fallback of 0 if windowSize.height is undefined
    // const height = windowSize.height ?? 0;

    setIsSticky(isScrollPastNavigation && scrollY > (windowSize.height ?? 0));
    setIsStuck(scrollY > navigationHeight);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [scrollY, windowSize.height]);


	useEffect(() => {
		if (isDesktop) {
			setIsOpen(false)
			setLocked(false)
		}
	}, [isDesktop])

	useEffect(() => {
		if (isOpen) {
			setIsOpen(false)
			setLocked(false)
		}

		setIsFixedAlwaysTrue(false)

		// Reset sticky/stuck on route change
		requestAnimationFrame(() => {
			setIsSticky(false)
			setIsStuck(false)
		})

		setIsFixedAlwaysTrue(
			router.asPath === "/contact" ||
				router.asPath === "/privacy-policy" ||
				router.asPath === "/terms-and-conditions" ||
				/^\/media(\/|$)/.test(router.asPath),
		)
	}, [router.asPath])

	return (
		<NavigationContext.Provider
			value={{
				ref,
				setRef,
				isOpen,
				setIsOpen,
				fixed: isFixedAlwaysTrue,
				sticky: isSticky,
				stuck: isStuck,
				toggle,
			}}
		>
			{children}
		</NavigationContext.Provider>
	)
}

// --- Custom hook ---
export default function useNavigationContext(): NavigationContextType {
	return useContext(NavigationContext)
}
