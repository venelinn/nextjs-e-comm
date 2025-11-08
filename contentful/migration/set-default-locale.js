const contentful = require("contentful-management")

const client = contentful.createClient({
	accessToken: "CFPAT-xUeGGTXyO6qXgd4FJW_ZEP-pGhPnePPHH1KqBzyX1uI",
})

const SPACE_ID = "6mpb9flgdgn9"
const ENVIRONMENT_ID = "master"
const TARGET_LOCALE = "en-CA"

;(async () => {
	const space = await client.getSpace(SPACE_ID)
	const env = await space.getEnvironment(ENVIRONMENT_ID)

	const locales = await env.getLocales()
	const target = locales.items.find((l) => l.code === TARGET_LOCALE)

	if (!target) {
		console.error(
			`❌ Locale ${TARGET_LOCALE} not found. Make sure it exists in your space.`,
		)
		return
	}

	// Make en-CA default
	target.default = true
	await target.update()
	console.log(`✅ Locale "${TARGET_LOCALE}" is now the default.`)

	// Optional: Disable en-US
	const enUS = locales.items.find((l) => l.code === "en-US")
	if (enUS) {
		enUS.fallbackCode = null
		enUS.contentManagementApi = false
		enUS.contentDeliveryApi = false
		await enUS.update()
		console.log(`🚫 Locale "en-US" has been disabled.`)
	}
})()
