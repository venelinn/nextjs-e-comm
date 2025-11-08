const contentful = require("contentful-management")

const client = contentful.createClient({
	accessToken: "CFPAT-xUeGGTXyO6qXgd4FJW_ZEP-pGhPnePPHH1KqBzyX1uI",
})

const SPACE_ID = "6mpb9flgdgn9"
const ENVIRONMENT_ID = "master" // change if you use other envs
const SOURCE_LOCALE = "en-US"
const TARGET_LOCALE = "en-CA"

async function run() {
	const space = await client.getSpace(SPACE_ID)
	const environment = await space.getEnvironment(ENVIRONMENT_ID)

	console.log("Fetching entries...")
	const entries = await environment.getEntries({ limit: 1000 }) // increase if needed

	for (const entry of entries.items) {
		let changed = false

		for (const fieldKey in entry.fields) {
			const field = entry.fields[fieldKey]

			// If en-US exists and en-CA doesn't, copy
			if (field[SOURCE_LOCALE] && !field[TARGET_LOCALE]) {
				field[TARGET_LOCALE] = field[SOURCE_LOCALE]
				changed = true
			}
		}

		if (changed) {
			try {
				await entry.update()
				await entry.publish()
				console.log(`✅ Updated ${entry.sys.id}`)
			} catch (err) {
				console.error(`❌ Error updating ${entry.sys.id}:`, err.message)
			}
		} else {
			console.log(`⚙️ Skipped ${entry.sys.id} — no changes`)
		}
	}

	console.log("Done!")
}

run().catch(console.error)
