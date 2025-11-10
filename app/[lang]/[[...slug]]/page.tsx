import { notFound } from "next/navigation";
import { componentMap } from "@/components"; // Your component map
import { IS_DEV } from "@/utils/common"; // Your dev check
import { getPageBySlug } from "@/utils/content";
import { getContentfulLocale, localization } from "@/utils/localization";

// Define the shape of a section from Contentful
type Section = {
  id: string;
  type: string;
  [key: string]: any;
};

// This is a Server Component, so we can make it async
export default async function Page({ params }: { params: { lang: string; slug?: string[] } }) {
  const { lang, slug = [] } = await params;

  // 1️⃣ Validate locale
  if (!localization.locales.includes(lang)) return notFound();

  // 2️⃣ Map to Contentful locale
  const contentfulLocale = getContentfulLocale(lang);

  // 3️⃣ Determine slug path for Contentful
  const path = slug.length > 0 ? slug.join("/") : "/";

  // 4️⃣ Fetch page from Contentful
  const pageData = await getPageBySlug(path, contentfulLocale);
  if (!pageData) return notFound();

  const page = pageData as { sections?: Section[]; pageName?: string };

  return (
    <>
      {/* This is the same logic from your old [[...slug]].tsx file.
          It maps over the sections and renders them.
      */}
      {page.sections?.length ? (
        page.sections.map((section) => {
          const Component = componentMap[section.type];
          if (!Component) {
            console.warn(`No component found for section type: ${section.type}`);
            return null;
          }

          return <Component key={section.id} {...section} pageName={page?.pageName} />;
        })
      ) : (
        <EmptyState />
      )}
    </>
  );
}

// --- Empty state (copied from your old file) ---
function EmptyState() {
  return IS_DEV ? (
    <div className="flex items-center justify-center w-full py-32">
      <div className="border-4 border-gray-400 rounded p-16 border-dashed flex flex-col gap-2 items-center">
        <span className="text-2xl">Empty page! Add sections.</span>
        <span>(this message does not appear in production)</span>
      </div>
    </div>
  ) : null;
}
