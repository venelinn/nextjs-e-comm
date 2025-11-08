import { createClient, Entry, type EntryCollection } from "contentful"
import { IS_DEV, normalizeSlug, PAGE_TYPE, SITE_CONFIG_TYPE } from "./common"
import localization from "./localization"

const client = createClient({
	accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || "",
	space: process.env.CONTENTFUL_SPACE_ID || "",
	environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
	host: "cdn.contentful.com",
})

async function getEntries(
	content_type: string,
	queryParams: { locale: string; [key: string]: any },
): Promise<EntryCollection<any>> {
	const { locale } = queryParams

	let contentfulLocale: string
	if (localization.contentfulLocales.includes(locale)) {
		contentfulLocale = locale
	} else {
		contentfulLocale =
			localization.getContentfulLocale?.(locale) ||
			localization.contentfulLocales[0]
	}

	const params = { ...queryParams, locale: contentfulLocale }
	return await client.getEntries({ content_type, ...params, include: 10 })
}

export async function getPagePaths(locale: string) {
	const { items } = await getEntries(PAGE_TYPE, { locale })

	return items
		.filter((x: any) => !["/media"].includes(x.fields.slug))
		.map((page: any) => {
			const slug = page.fields.slug.split("/").filter(Boolean)
			return {
				params: { slug },
				locale: page.sys.locale.split("-")[0],
			}
		})
}

export async function getPages(locale: string) {
	const response = await getEntries(PAGE_TYPE, { locale })
	return response.items.map((entry) => mapEntry(entry))
}

export async function getSiteConfig(locale: string) {
	const response = await getEntries(SITE_CONFIG_TYPE, { locale })
	const itemCount = response.items?.length
	if (itemCount === 1) {
		return mapEntry(response.items[0])
	} else {
		console.error("Expected 1 site config object, got:", itemCount)
		return null
	}
}

export async function getMediaItems(locale: string) {
	try {
		console.log("Fetching media items for locale:", locale)
		const response = await getEntries("media", { locale })

		if (!response.items) {
			console.error("No items found in the response:", response)
			return []
		}

		return response.items.map((entry) => mapEntry(entry))
	} catch (error) {
		console.error("Error fetching media items:", error)
		return []
	}
}

export async function getContentItems(
	contentType: string = "media",
	locale: string,
) {
	try {
		const response = await getEntries(contentType, { locale })

		if (!response.items) {
			console.error(
				`No items found in the response for content type: ${contentType}`,
				response,
			)
			return []
		}

		return response.items.map((entry) => mapEntry(entry))
	} catch (error) {
		console.error(
			`Error fetching items for content type: ${contentType}`,
			error,
		)
		return []
	}
}

function mapEntry(entry: any, localePassed?: string) {
	const id = entry.sys?.id
	const type = entry.sys?.contentType?.sys?.id || entry.sys?.type
	const locale = entry.sys?.locale?.split("-")[0] || localePassed

	if (entry?.type === "upload") {
		const { public_id, resource_type, secure_url } = entry

		return {
			id: public_id,
			type: resource_type,
			src: secure_url,
			alt: "",
			locale,
			width: entry.width,
			height: entry.height,
		}
	}

	if (entry.fields) {
		return {
			id,
			type,
			locale,
			...Object.fromEntries(
				Object.entries(entry.fields).map(([key, value]) => [
					key,
					parseField(value, locale),
				]),
			),
		}
	}
	return null
}

function parseField(value: any, locale: string) {
	if (typeof value === "object" && value?.sys) return mapEntry(value, locale)
	if (Array.isArray(value)) return value.map((v) => mapEntry(v, locale))
	return value
}

async function getContentModel(contentType: string, locale: string) {
	const contentfulLocale =
		localization.contentfulLocales[localization.locales.indexOf(locale)] ||
		locale

	try {
		const entries = await client.getEntries({
			content_type: contentType,
			locale: contentfulLocale,
		})

		const publishedEntries = entries.items.filter(
			(entry) => !!(entry.sys as any).publishedAt,
		)

		return publishedEntries.map((entry) => entry.fields)
	} catch (error: any) {
		console.error(`Error fetching entries: ${error.message}`)
		throw error
	}
}

export async function getNavigationLinks(pages: any[], locale: string) {
	const contentfulLocale =
		localization.contentfulLocales[localization.locales.indexOf(locale)] ||
		locale
	const customLinks = await getContentModel("customLinks", contentfulLocale)

	const remappedCustomLinks = customLinks
		.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
		.map((link: any) => ({
			pageName: link.text,
			slug: link.url ?? null,
			locale,
			target: link.target,
			order: link.order ?? null,
			location: link.location ?? null,
		}))

	const navigationLinks = pages
		.filter((e) => e.locale === locale)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
		.map((e) => ({
			pageName: e.pageName,
			slug: normalizeSlug(e.slug),
			locale: e.locale,
			order: e.order ?? null,
			location: e.location ?? null,
		}))

	return [...navigationLinks, ...remappedCustomLinks]
}
