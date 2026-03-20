export type AppTheme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "kapxr:theme";
const THEME_EVENT_NAME = "kapxr:theme-changed";

function isValidTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark" || value === "system";
}

export function getTheme(): AppTheme {
  if (typeof window === "undefined") return "system";
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isValidTheme(value) ? value : "system";
}

export function getThemeEventName() {
  return THEME_EVENT_NAME;
}

export function resolveTheme(theme: AppTheme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyThemeToDocument(theme: AppTheme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
}

export function setTheme(theme: AppTheme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyThemeToDocument(theme);
  window.dispatchEvent(new CustomEvent<AppTheme>(THEME_EVENT_NAME, { detail: theme }));
}
