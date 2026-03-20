export type UiDensity = "standard" | "compact";

const UI_DENSITY_STORAGE_KEY = "kapxr:ui-density";
const UI_DENSITY_EVENT = "kapxr-ui-density-change";
const DEFAULT_UI_DENSITY: UiDensity = "compact";

export function getUiDensity(): UiDensity {
  if (typeof window === "undefined") return DEFAULT_UI_DENSITY;
  const saved = window.localStorage.getItem(UI_DENSITY_STORAGE_KEY);
  return saved === "standard" || saved === "compact" ? saved : DEFAULT_UI_DENSITY;
}

export function applyUiDensityToDocument(density: UiDensity) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.uiDensity = density;
}

export function setUiDensity(density: UiDensity) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UI_DENSITY_STORAGE_KEY, density);
  applyUiDensityToDocument(density);
  window.dispatchEvent(new CustomEvent<UiDensity>(UI_DENSITY_EVENT, { detail: density }));
}

export function getUiDensityEventName() {
  return UI_DENSITY_EVENT;
}
