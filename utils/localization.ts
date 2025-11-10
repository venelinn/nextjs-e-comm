// Use 'export const' instead of 'module.exports'

export const localization = {
  contentfulLocales: ["en-CA", "fr-CA", "es-US"],
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  nonLocalizedModels: ["siteConfig"],
};

export const getContentfulLocale = (locale: string) => {
  const index = localization.locales.indexOf(locale);
  if (index !== -1) {
    return localization.contentfulLocales[index];
  }
  // Fallback to the first locale if not found
  return localization.contentfulLocales[0];
};

// Export all properties as a default object for convenience,
// just like your old file did.
