import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import { getNavigationLinks, getPageBySlug, getPages, getSiteConfig } from "@/utils/content";
import { getContentfulLocale } from "@/utils/localization";
import { ClientLayout } from "../ClientLayout";

/**
 * This is the main layout for all localized pages (e.g., /en/about, /fr/about).
 * It replaces your old `pages/_app.tsx`.
 *
 * It's a Server Component, so we can fetch data directly in it.
 */
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug = [] } = await params;
  const contentfulLocale = getContentfulLocale(lang);

  // --- Data Fetching (Server-Side) ---
  const siteConfig = await getSiteConfig(contentfulLocale);
  if (!siteConfig) {
    // If site config fails, it's a critical error
    notFound();
  }
  const path = slug.join("/") || "home";
  const pages = await getPages(contentfulLocale);
  const navLinks = await getNavigationLinks(pages, lang); // Use 'lang' (e.g., 'en')
  const pageData = await getPageBySlug(path, contentfulLocale);

  // Filter links for their location
  // const headerLinks = navLinks.filter((link) => link.location === "header");
  // const footerLinks = navLinks.filter((link) => link.location === "footer");

  return (
    <ClientLayout lang={lang}>
      <div className="content-grid">
        <Navigation
          links={navLinks}
          pageLocale={lang}
          siteConfig={siteConfig}
          isLogoVisible={pageData?.isLogoVisible}
          isNavigationVisible={pageData?.isNavigationVisible}
        />

        {/* The 'children' will be your 'page.tsx' or '[...slug]/page.tsx' */}
        {children}

        <Footer siteConfig={siteConfig} pageLocale={lang} />
      </div>
    </ClientLayout>
  );
}
