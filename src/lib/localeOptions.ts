/**
 * Global language and timezone options using built-in Intl APIs (no external API key).
 * - Timezones: Intl.supportedValuesOf('timeZone') when available (IANA IDs)
 * - Languages: ISO 639-1 + common regional BCP-47 tags, labels via Intl.DisplayNames
 */

/**
 * Detects the user's current timezone from their browser/device (IANA ID, e.g. America/New_York).
 */
export function getCurrentTimezone(): string {
  if (typeof window === "undefined") return "UTC";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  } catch {
    return "UTC";
  }
}

/** ISO 639-1 two-letter codes (complete set). */
const ISO_639_1_CODES = [
  "aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bh", "bm", "bn", "bo", "br", "bs",
  "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa",
  "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz",
  "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko",
  "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn",
  "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa",
  "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so",
  "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty",
  "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu",
] as const;

/** Common regional variants (BCP 47) beyond bare ISO codes. */
const EXTRA_LOCALE_TAGS = [
  "en-US", "en-GB", "en-AU", "en-CA", "en-IN", "en-NZ", "en-IE", "en-ZA",
  "es-ES", "es-MX", "es-AR", "es-CO", "es-CL",
  "pt-BR", "pt-PT",
  "fr-FR", "fr-CA", "fr-BE", "fr-CH",
  "de-DE", "de-AT", "de-CH",
  "zh-CN", "zh-TW", "zh-HK", "zh-SG",
  "ja-JP", "ko-KR",
  "ar-SA", "ar-AE", "ar-EG",
  "hi-IN", "bn-IN", "bn-BD",
  "it-IT", "nl-NL", "nl-BE", "sv-SE", "no-NO", "nb-NO", "nn-NO", "da-DK", "fi-FI",
  "pl-PL", "tr-TR", "ru-RU", "uk-UA", "cs-CZ", "sk-SK", "ro-RO", "hu-HU", "el-GR",
  "he-IL", "th-TH", "vi-VN", "id-ID", "ms-MY", "fil-PH", "tl-PH",
  "sw-KE", "sw-TZ", "af-ZA", "zu-ZA", "xh-ZA",
];

/** Curated fallback when Intl.supportedValuesOf('timeZone') is unavailable. */
const TIMEZONE_FALLBACK = [
  "UTC",
  "Africa/Abidjan", "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
  "America/Anchorage", "America/Argentina/Buenos_Aires", "America/Bogota", "America/Caracas", "America/Chicago",
  "America/Denver", "America/Los_Angeles", "America/Mexico_City", "America/New_York", "America/Phoenix", "America/Santiago",
  "America/Sao_Paulo", "America/Toronto", "America/Vancouver",
  "Asia/Bangkok", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Jakarta", "Asia/Jerusalem", "Asia/Kolkata", "Asia/Seoul",
  "Asia/Shanghai", "Asia/Singapore", "Asia/Tokyo", "Asia/Riyadh", "Asia/Manila", "Asia/Karachi", "Asia/Dhaka",
  "Australia/Melbourne", "Australia/Perth", "Australia/Sydney",
  "Europe/Amsterdam", "Europe/Berlin", "Europe/Brussels", "Europe/Dublin", "Europe/Helsinki", "Europe/Istanbul",
  "Europe/Lisbon", "Europe/London", "Europe/Madrid", "Europe/Moscow", "Europe/Paris", "Europe/Rome", "Europe/Stockholm",
  "Europe/Vienna", "Europe/Warsaw", "Europe/Zurich",
  "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu",
];

export type SelectOption = { value: string; label: string };

function formatTimezoneLabel(timeZone: string): string {
  if (timeZone === "UTC") return "UTC (Coordinated Universal Time)";
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return offset ? `${timeZone} (${offset})` : timeZone;
  } catch {
    return timeZone;
  }
}

/**
 * All IANA time zones supported by the runtime, sorted by label.
 */
export function getTimezoneOptions(): SelectOption[] {
  let zones: string[];
  try {
    const intl = Intl as typeof Intl & {
      supportedValuesOf?: (key: "timeZone") => string[];
    };
    zones =
      typeof Intl !== "undefined" && typeof intl.supportedValuesOf === "function"
        ? intl.supportedValuesOf("timeZone")
        : TIMEZONE_FALLBACK;
  } catch {
    zones = TIMEZONE_FALLBACK;
  }
  const unique = [...new Set(zones)].sort((a, b) => a.localeCompare(b));
  return unique.map((value) => ({
    value,
    label: formatTimezoneLabel(value),
  }));
}

function languageLabelForTag(tag: string, displayNames: Intl.DisplayNames): string {
  try {
    const label = displayNames.of(tag);
    if (label) return `${label} (${tag})`;
  } catch {
    /* ignore */
  }
  const base = tag.split("-")[0] ?? tag;
  try {
    const baseLabel = displayNames.of(base);
    if (baseLabel) return `${baseLabel} (${tag})`;
  } catch {
    /* ignore */
  }
  return tag;
}

/**
 * Global language list: ISO 639-1 codes + common regional locales, sorted by label.
 */
export function getLanguageOptions(): SelectOption[] {
  const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
  const tags = new Set<string>([...ISO_639_1_CODES, ...EXTRA_LOCALE_TAGS]);
  const options: SelectOption[] = [];
  for (const tag of tags) {
    options.push({
      value: tag,
      label: languageLabelForTag(tag, displayNames),
    });
  }
  options.sort((a, b) => a.label.localeCompare(b.label, "en"));
  return options;
}
