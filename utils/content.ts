import { createClient, Entry, type EntryCollection } from "contentful";
import { IS_DEV, normalizeSlug, PAGE_TYPE, SITE_CONFIG_TYPE } from "./common";
import { getContentfulLocale, localization } from "./localization";

const client = createClient({
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || "",
  space: process.env.CONTENTFUL_SPACE_ID || "",
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  host: "cdn.contentful.com",
});

// Utility function to safely determine the Contentful locale and fetch entries
async function getEntries(
  content_type: string,
  queryParams: { locale: string; [key: string]: any },
): Promise<EntryCollection<any>> {
  const { locale } = queryParams;

  let contentfulLocale: string;
  // 1. Check if the provided locale is a direct Contentful locale
  if (localization.contentfulLocales.includes(locale)) {
    contentfulLocale = locale;
  } else {
    // 2. Try to derive the Contentful locale, or fall back to the first defined locale
    contentfulLocale = getContentfulLocale?.(locale) || localization.contentfulLocales[0];
  }

  // Ensure contentfulLocale is always a string and not null/undefined
  if (!contentfulLocale) {
    console.error("No valid contentful locale found or defaulted.");
    return { items: [], total: 0, skip: 0, limit: 0, sys: {} as any };
  }

  const params = { ...queryParams, locale: contentfulLocale };
  // Include 10 to resolve nested references
  return await client.getEntries({ content_type, ...params, include: 10 });
}

/**
 * Fetches a single page entry by its slug.
 */
export async function getPageBySlug(slug: string, locale: string) {
  // Handle homepage slug
  const pageSlug = slug === "/" ? "/" : slug;

  const { items } = await getEntries(PAGE_TYPE, {
    locale,
    "fields.slug": pageSlug,
    limit: 1,
  });
  if (items.length > 0) {
    return mapEntry(items[0]);
  }
  return null;
}
// --- END NEW FUNCTION ---

export async function getPagePaths(locale: string) {
  const { items } = await getEntries(PAGE_TYPE, { locale });

  return items
    .filter((x: any) => !["/media"].includes(x.fields.slug))
    .map((page: any) => {
      const slug = page.fields.slug.split("/").filter(Boolean);
      return {
        params: { slug },
        locale: page.sys.locale.split("-")[0],
      };
    });
}

export async function getPages(locale: string) {
  const response = await getEntries(PAGE_TYPE, { locale });
  return response.items.map((entry) => mapEntry(entry));
}

export async function getSiteConfig(locale: string) {
  const response = await getEntries(SITE_CONFIG_TYPE, { locale });
  const itemCount = response.items?.length;
  if (itemCount === 1) {
    return mapEntry(response.items[0]);
  } else {
    console.error("Expected 1 site config object, got:", itemCount);
    return null;
  }
}

export async function getMediaItems(locale: string) {
  try {
    const response = await getEntries("media", { locale });

    if (!response.items) {
      console.error("No items found in the response:", response);
      return [];
    }

    return response.items.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error("Error fetching media items:", error);
    return [];
  }
}

export async function getContentItems(contentType: string = "media", locale: string) {
  try {
    const response = await getEntries(contentType, { locale });

    if (!response.items) {
      console.error(`No items found in the response for content type: ${contentType}`, response);
      return [];
    }

    return response.items.map((entry) => mapEntry(entry));
  } catch (error) {
    console.error(`Error fetching items for content type: ${contentType}`, error);
    return [];
  }
}

// Fetch a single item by ID
export async function getContentItem(contentType: string, id: string, locale: string) {
  const res = await client.getEntries({
    content_type: contentType,
    "sys.id": id,
    locale,
  });

  return res.items[0].fields;
}

// *** ADDED HELPER FUNCTION: Fetch multiple items by ID ***
export async function getProductItemsByIds(ids: string[], locale: string) {
  if (!ids || ids.length === 0) return [];

  // We fetch products based on their system IDs
  const res = await getEntries("product", {
    locale,
    "sys.id[in]": ids.join(","),
    limit: 100, // Set a reasonable limit for cart items
  });

  // Map the raw products using mapEntry for full field and asset resolution
  return res.items.map((entry) => mapEntry(entry));
}

function mapEntry(entry: any, localePassed?: string) {
  const id = entry.sys?.id;
  const type = entry.sys?.contentType?.sys?.id || entry.sys?.type;
  const locale = entry.sys?.locale?.split("-")[0] || localePassed;

  if (entry?.type === "upload") {
    const { public_id, resource_type, secure_url } = entry;

    return {
      id: public_id,
      type: resource_type,
      src: secure_url,
      alt: "",
      locale,
      width: entry.width,
      height: entry.height,
    };
  }

  if (entry.fields) {
    return {
      id,
      type,
      locale,
      ...Object.fromEntries(
        Object.entries(entry.fields).map(([key, value]) => [
          // Preserve original casing here, which fixes siteConfig issues
          key,
          parseField(value, locale),
        ]),
      ),
    };
  }
  return null;
}

function parseField(value: any, locale: string) {
  if (typeof value === "object" && value?.sys) return mapEntry(value, locale);
  if (Array.isArray(value)) return value.map((v) => mapEntry(v, locale));
  return value;
}

async function getContentModel(contentType: string, locale: string) {
  try {
    // Use the safe getEntries wrapper which handles locale validation and includes: 10
    const entries = await getEntries(contentType, { locale });

    // Map all returned items (which should be published by CDN) for full field resolution
    return entries.items.map((entry) => mapEntry(entry, locale));
  } catch (error: any) {
    console.warn(`⚠️ Contentful: Could not fetch ${contentType} (${locale}) → ${error.message}`);
    return []; // <- don’t throw, just return empty
  }
}

export async function getNavigationLinks(pages: any[], locale: string) {
  // getContentModel now uses the safe getEntries wrapper
  const customLinks = await getContentModel("customLinks", locale);

  const remappedCustomLinks = customLinks
    // Access customLinks fields using TitleCase (Text, URL, Order) based on the Contentful model screenshot
    .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0))
    .map((link: any) => ({
      pageName: link.text,
      slug: link.url ?? null,
      locale,
      target: link.target,
      order: link.order ?? null,
      location: link.location ?? null,
    }));

  const navigationLinks = pages
    .filter((e) => e.locale === locale)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((e) => ({
      // Access standard page field using camelCase (pageName)
      pageName: e.pageName,
      slug: normalizeSlug(e.slug),
      locale: e.locale,
      order: e.order ?? null,
      location: e.location ?? null,
    }));

  return [...navigationLinks, ...remappedCustomLinks];
}
