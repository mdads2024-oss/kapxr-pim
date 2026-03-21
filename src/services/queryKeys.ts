export const queryKeys = {
  products: () => ["products"] as const,
  brands: () => ["brands"] as const,
  categories: () => ["categories"] as const,
  assets: () => ["assets"] as const,
  attributes: () => ["attributes"] as const,
  integrations: () => ["integrations"] as const,
  importExportHistory: () => ["import-export-history"] as const,
  analyticsMetrics: () => ["analytics-metrics"] as const,
  teamMembers: () => ["team-members"] as const,
  billingPlans: () => ["billing-plans"] as const,
  billingSubscription: () => ["billing-subscription"] as const,
};
