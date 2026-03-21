/** URL-safe slug from a display name (matches demo attribute/category detail routes). */
export function toParamSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
