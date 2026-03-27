/**
 * Bump when you publish new legal text so acceptance records stay meaningful.
 * Not a substitute for counsel review of the documents themselves.
 */
export const LEGAL_DOCUMENTS_VERSION = "2025-03-27"

/** Placeholders — replace before production; required for GDPR transparency. */
export const LEGAL_PLACEHOLDER = {
  controllerName: "Jesper Lindberg",
  controllerCountry: "Sweden",
  contactEmail: "JesperLindberg92@protonmail.com",
  /** Where your Supabase project stores data (confirm in dashboard). */
  hostingRegion: "EU (Ireland)",
  controllerCity: "Uppsala",
} as const
