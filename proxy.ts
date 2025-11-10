import { type NextRequest, NextResponse } from "next/server";
import { localization } from "./utils/localization";

const { locales, defaultLocale } = localization;

/**
 * This is the i18n proxy for Next.js 16.
 * It intercepts requests and rewrites them to the default locale
 * if no locale is present.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = new URL(request.url);
  console.log("🌀 Incoming path:", pathname);

  // 1. Check if the path is for a static file (e.g., /logo.svg)
  // If so, do nothing and let the request continue.
  const publicFile = /\.(.*)$/;
  const ignoredPrefixes = [
    "/_next",
    "/api",
    "/static",
    "/.well-known",
    "/auth", // <-- whitelist auth
  ];

  if (ignoredPrefixes.some((prefix) => pathname.startsWith(prefix)) || publicFile.test(pathname)) {
    return NextResponse.next();
  }

  // 2. Check if the path already has a locale prefix (e.g., /fr/about)
  const hasLocale = localization.locales.some(
    (locale) => url.pathname === `/${locale}` || url.pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  // Rewrite missing locale to default
  url.pathname = `/${localization.defaultLocale}${url.pathname}`;
  return NextResponse.rewrite(url);
}

// The config matcher remains the same.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
