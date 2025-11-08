import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { componentMap } from "@/components"
import { Layout } from "@/components/Layout"
import { IS_DEV, normalizeSlug } from "@/utils/common"
import {
	getNavigationLinks,
	getPagePaths,
	getPages,
	getSiteConfig,
} from "../utils/content"
import localization from "../utils/localization"

// --- Types ---
type Section = {
	id: string
	type: string
	[key: string]: any // allow other properties
}

type PageType = {
	slug: string
	locale: string
	pageName?: string
	sections?: Section[]
}

type SiteConfig = any // define your structure if you have one
type NavigationLink = any // define your structure if you have one

type Props = {
	page: PageType
	siteConfig: SiteConfig
	navigationLinks: NavigationLink[]
}

// --- Page Component ---
const ComposablePage: NextPage<Props> = ({
	page,
	siteConfig,
	navigationLinks,
}) => {
	return (
		<Layout
			page={page}
			siteConfig={siteConfig}
			navigationLinks={navigationLinks}
		>
			{page.sections?.length ? (
				page.sections.map((section) => {
					const Component = componentMap[section.type]
					if (!Component) return null

					return (
						<Component
							key={section.id}
							{...section}
							pageName={page?.pageName}
						/>
					)
				})
			) : (
				<EmptyState />
			)}
		</Layout>
	)
}

// --- Empty state ---
function EmptyState() {
	return IS_DEV ? (
		<div className="flex items-center justify-center w-full py-32">
			<div className="border-4 border-gray-400 rounded p-16 border-dashed flex flex-col gap-2 items-center">
				<span className="text-2xl">Empty page! add sections.</span>
				<span>(this message does not appear in production)</span>
			</div>
		</div>
	) : null
}

// --- getStaticPaths ---
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const routesPromises =
		locales?.map(async (locale) => await getPagePaths(locale)) || []
	const pathsArray = await Promise.all(routesPromises)
	const paths = pathsArray.flatMap((p) => p)

	return { paths, fallback: false }
}

// --- getStaticProps ---
export const getStaticProps = async ({ params, locale }) => {
  const slugArray = params?.slug ?? [];
	const slug = "/" + slugArray.filter(Boolean).join("/");

  const pageLocale = locale || localization.defaultLocale;

  const [siteConfig, allPages] = await Promise.all([
    getSiteConfig(pageLocale),
    getPages(pageLocale),
  ]);

  const page = allPages.find(
    (e) => normalizeSlug(e.slug) === slug && e.locale === pageLocale
  );

  if (!page) {
    console.warn("Did not find page for:", params, "locale:", locale);
    return { notFound: true };
  }

  const navigationLinks = await getNavigationLinks(allPages, pageLocale);

  return {
    props: {
      page,
      siteConfig,
      navigationLinks,
    },
  };
};

export default ComposablePage
