import type {
  AnalyticsMetric,
  Asset,
  Attribute,
  Brand,
  Category,
  ImportExportHistoryItem,
  Integration,
  Product,
  TeamMember,
} from "@/types/pim";

export interface PIMProvider {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  createProduct(data: Omit<Product, "id">): Promise<Product>;
  updateProduct(id: number, data: Partial<Omit<Product, "id">>): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;

  getBrands(): Promise<Brand[]>;
  getBrandById(id: number): Promise<Brand | null>;
  createBrand(data: Omit<Brand, "id">): Promise<Brand>;
  updateBrand(id: number, data: Partial<Omit<Brand, "id">>): Promise<Brand | null>;
  deleteBrand(id: number): Promise<boolean>;

  getCategories(): Promise<Category[]>;
  createCategory(data: Omit<Category, "id">): Promise<Category>;
  updateCategory(id: number, data: Partial<Omit<Category, "id">>): Promise<Category | null>;
  deleteCategory(id: number): Promise<boolean>;

  getAssets(): Promise<Asset[]>;
  createAsset(data: Omit<Asset, "id">): Promise<Asset>;
  updateAsset(id: number, data: Partial<Omit<Asset, "id">>): Promise<Asset | null>;
  deleteAsset(id: number): Promise<boolean>;
  getAttributes(): Promise<Attribute[]>;
  createAttribute(data: Omit<Attribute, "id">): Promise<Attribute>;
  updateAttribute(id: number, data: Partial<Omit<Attribute, "id">>): Promise<Attribute | null>;
  deleteAttribute(id: number): Promise<boolean>;
  getIntegrations(): Promise<Integration[]>;
  updateIntegration(id: number, data: Partial<Omit<Integration, "id">>): Promise<Integration | null>;
  getImportExportHistory(): Promise<ImportExportHistoryItem[]>;
  createImportExportHistoryItem(
    data: Omit<ImportExportHistoryItem, "id">
  ): Promise<ImportExportHistoryItem>;
  getAnalyticsMetrics(): Promise<AnalyticsMetric[]>;
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember>;
  updateTeamMember(id: number, data: Partial<Omit<TeamMember, "id">>): Promise<TeamMember | null>;
  deleteTeamMember(id: number): Promise<boolean>;
}
