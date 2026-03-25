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
import type { PimEntityId } from "@/types/pim";

export interface PIMProvider {
  getProducts(): Promise<Product[]>;
  getProductById(id: PimEntityId): Promise<Product | null>;
  createProduct(data: Omit<Product, "id">): Promise<Product>;
  updateProduct(id: PimEntityId, data: Partial<Omit<Product, "id">>): Promise<Product | null>;
  deleteProduct(id: PimEntityId): Promise<boolean>;

  getBrands(): Promise<Brand[]>;
  getBrandById(id: PimEntityId): Promise<Brand | null>;
  createBrand(data: Omit<Brand, "id">): Promise<Brand>;
  updateBrand(id: PimEntityId, data: Partial<Omit<Brand, "id">>): Promise<Brand | null>;
  deleteBrand(id: PimEntityId): Promise<boolean>;

  getCategories(): Promise<Category[]>;
  createCategory(data: Omit<Category, "id">): Promise<Category>;
  updateCategory(id: PimEntityId, data: Partial<Omit<Category, "id">>): Promise<Category | null>;
  deleteCategory(id: PimEntityId): Promise<boolean>;

  getAssets(): Promise<Asset[]>;
  createAsset(data: Omit<Asset, "id">): Promise<Asset>;
  updateAsset(id: PimEntityId, data: Partial<Omit<Asset, "id">>): Promise<Asset | null>;
  deleteAsset(id: PimEntityId): Promise<boolean>;
  getAttributes(): Promise<Attribute[]>;
  createAttribute(data: Omit<Attribute, "id">): Promise<Attribute>;
  updateAttribute(id: PimEntityId, data: Partial<Omit<Attribute, "id">>): Promise<Attribute | null>;
  deleteAttribute(id: PimEntityId): Promise<boolean>;

  saveProductAttributeValues(
    productId: PimEntityId,
    values: Array<{ attributeId: PimEntityId; value: unknown }>
  ): Promise<void>;

  getIntegrations(): Promise<Integration[]>;
  updateIntegration(id: PimEntityId, data: Partial<Omit<Integration, "id">>): Promise<Integration | null>;
  getImportExportHistory(): Promise<ImportExportHistoryItem[]>;
  createImportExportHistoryItem(
    data: Omit<ImportExportHistoryItem, "id">
  ): Promise<ImportExportHistoryItem>;
  getAnalyticsMetrics(): Promise<AnalyticsMetric[]>;
  getTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember>;
  updateTeamMember(id: PimEntityId, data: Partial<Omit<TeamMember, "id">>): Promise<TeamMember | null>;
  deleteTeamMember(id: PimEntityId): Promise<boolean>;
}
