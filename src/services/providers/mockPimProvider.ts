import { MockStorage } from "@/lib/mockStorage";
import {
  analyticsMetricSeed,
  assetTableSeed,
  attributeTableSeed,
  brandTableSeed,
  categoryTableSeed,
  importExportTableSeed,
  integrationTableSeed,
  productTableSeed,
  teamMemberSeed,
} from "@/mockdb/tables";
import type {
  Brand,
  Category,
  Product,
  Asset,
  Attribute,
  Integration,
  ImportExportHistoryItem,
  TeamMember,
} from "@/types/pim";
import type { PIMProvider } from "@/services/providers/pimProvider";

const seedVersion = "2026-03-20-expanded-seed-v1";
const brandSeedVersion = "2026-03-21-brands-v1";

const productStorage = new MockStorage<Product>("kapxr:products", productTableSeed, { seedVersion });
const brandStorage = new MockStorage<Brand>("kapxr:brands", brandTableSeed, { seedVersion: brandSeedVersion });
const categoryStorage = new MockStorage<Category>("kapxr:categories", categoryTableSeed, { seedVersion });
const assetStorage = new MockStorage<Asset>("kapxr:assets", assetTableSeed, { seedVersion });
const integrationStorage = new MockStorage<Integration>("kapxr:integrations", integrationTableSeed, { seedVersion });
const importExportStorage = new MockStorage<ImportExportHistoryItem>(
  "kapxr:import-export-history",
  importExportTableSeed,
  { seedVersion }
);
const teamStorage = new MockStorage<TeamMember>("kapxr:team-members", teamMemberSeed, { seedVersion });
const attributeStorage = new MockStorage<Attribute>("kapxr:attributes", attributeTableSeed, { seedVersion });

const delay = async (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPimProvider: PIMProvider = {
  async getProducts() {
    return productStorage.getAll();
  },

  async getProductById(id) {
    return productStorage.getById(id);
  },

  async createProduct(data) {
    return productStorage.create(data);
  },

  async updateProduct(id, data) {
    return productStorage.update(id, data);
  },

  async deleteProduct(id) {
    return productStorage.remove(id);
  },

  async getBrands() {
    return brandStorage.getAll();
  },

  async getBrandById(id) {
    return brandStorage.getById(id);
  },

  async createBrand(data) {
    return brandStorage.create(data);
  },

  async updateBrand(id, data) {
    return brandStorage.update(id, data);
  },

  async deleteBrand(id) {
    return brandStorage.remove(id);
  },

  async getCategories() {
    return categoryStorage.getAll();
  },

  async createCategory(data) {
    return categoryStorage.create(data);
  },

  async updateCategory(id, data) {
    return categoryStorage.update(id, data);
  },

  async deleteCategory(id) {
    return categoryStorage.remove(id);
  },

  async getAssets() {
    return assetStorage.getAll();
  },

  async createAsset(data) {
    return assetStorage.create(data);
  },

  async updateAsset(id, data) {
    return assetStorage.update(id, data);
  },

  async deleteAsset(id) {
    return assetStorage.remove(id);
  },

  async getAttributes() {
    return attributeStorage.getAll();
  },

  async createAttribute(data) {
    return attributeStorage.create(data);
  },

  async updateAttribute(id, data) {
    return attributeStorage.update(id, data);
  },

  async deleteAttribute(id) {
    return attributeStorage.remove(id);
  },

  async saveProductAttributeValues() {
    // Mock mode: attribute values are not persisted.
    await delay();
  },

  async getIntegrations() {
    return integrationStorage.getAll();
  },

  async updateIntegration(id, data) {
    return integrationStorage.update(id, data);
  },

  async getImportExportHistory() {
    return importExportStorage.getAll();
  },

  async createImportExportHistoryItem(data) {
    return importExportStorage.create(data);
  },

  async getAnalyticsMetrics() {
    await delay();
    return analyticsMetricSeed;
  },

  async getTeamMembers() {
    return teamStorage.getAll();
  },

  async createTeamMember(data) {
    return teamStorage.create(data);
  },

  async updateTeamMember(id, data) {
    return teamStorage.update(id, data);
  },

  async deleteTeamMember(id) {
    return teamStorage.remove(id);
  },
};
