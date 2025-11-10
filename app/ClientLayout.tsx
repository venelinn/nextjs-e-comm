"use client"; // This is the most important line!

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { usePathname } from "next/navigation"; // <- App Router hook
import { useEffect } from "react";
import { NavigationContextProvider } from "../context/navigationContext";
import { TransitionContextProvider } from "../context/transitionContext";
import useNextCssRemovalPrevention from "../hooks/useNextCssRemovalPrevention";
import { DataProvider } from "../utils/DataProvider";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export function ClientLayout({ children, lang }: { children: React.ReactNode; lang: string }) {
  const pathname = usePathname(); // New App Router hook

  /* Removes focus from next/link element after page change */
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [pathname]); // Use pathname, not router

  /* Update HTML lang attribute */
  useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  /* Temporary fix to avoid flash of unstyled content (FOUC) */
  useNextCssRemovalPrevention();

  // All your context providers wrap the children
  return (
    <TransitionContextProvider>
      <NavigationContextProvider>
        <DataProvider>{children}</DataProvider>
      </NavigationContextProvider>
    </TransitionContextProvider>
  );
}
