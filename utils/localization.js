const localization = {
	contentfulLocales: ["en-CA", "fr-CA", "es-US"],
	locales: ["en", "fr", "es"],
	defaultLocale: "en",
	nonLocalizedModels: ["siteConfig"],
};

module.exports = {
	...localization,
	getContentfulLocale: (locale) =>
		localization.contentfulLocales[localization.locales.indexOf(locale)],
};
