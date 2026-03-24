import { mockPimProvider } from "@/services/providers/mockPimProvider";
import type { PIMProvider } from "@/services/providers/pimProvider";
import type { PimEntityId } from "@/types/pim";

let activeProvider: PIMProvider = mockPimProvider;

export const setPimProvider = (provider: PIMProvider) => {
  activeProvider = provider;
};

export const pimService = {
  async getProducts() {
    return activeProvider.getProducts();
  },

  async getProductById(id: PimEntityId) {
    return activeProvider.getProductById(id);
  },

  async createProduct(data: Parameters<PIMProvider["createProduct"]>[0]) {
    return activeProvider.createProduct(data);
  },

  async updateProduct(id: PimEntityId, data: Parameters<PIMProvider["updateProduct"]>[1]) {
    return activeProvider.updateProduct(id, data);
  },

  async deleteProduct(id: PimEntityId) {
    return activeProvider.deleteProduct(id);
  },

  async getBrands() {
    return activeProvider.getBrands();
  },

  async getBrandById(id: PimEntityId) {
    return activeProvider.getBrandById(id);
  },

  async createBrand(data: Parameters<PIMProvider["createBrand"]>[0]) {
    return activeProvider.createBrand(data);
  },

  async updateBrand(id: PimEntityId, data: Parameters<PIMProvider["updateBrand"]>[1]) {
    return activeProvider.updateBrand(id, data);
  },

  async deleteBrand(id: PimEntityId) {
    return activeProvider.deleteBrand(id);
  },

  async getCategories() {
    return activeProvider.getCategories();
  },

  async createCategory(data: Parameters<PIMProvider["createCategory"]>[0]) {
    return activeProvider.createCategory(data);
  },

  async updateCategory(id: PimEntityId, data: Parameters<PIMProvider["updateCategory"]>[1]) {
    return activeProvider.updateCategory(id, data);
  },

  async deleteCategory(id: PimEntityId) {
    return activeProvider.deleteCategory(id);
  },

  async getAssets() {
    return activeProvider.getAssets();
  },

  async createAsset(data: Parameters<PIMProvider["createAsset"]>[0]) {
    return activeProvider.createAsset(data);
  },

  async updateAsset(id: PimEntityId, data: Parameters<PIMProvider["updateAsset"]>[1]) {
    return activeProvider.updateAsset(id, data);
  },

  async deleteAsset(id: PimEntityId) {
    return activeProvider.deleteAsset(id);
  },

  async getAttributes() {
    return activeProvider.getAttributes();
  },

  async createAttribute(data: Parameters<PIMProvider["createAttribute"]>[0]) {
    return activeProvider.createAttribute(data);
  },

  async updateAttribute(id: PimEntityId, data: Parameters<PIMProvider["updateAttribute"]>[1]) {
    return activeProvider.updateAttribute(id, data);
  },

  async deleteAttribute(id: PimEntityId) {
    return activeProvider.deleteAttribute(id);
  },

  async getIntegrations() {
    return activeProvider.getIntegrations();
  },

  async updateIntegration(id: PimEntityId, data: Parameters<PIMProvider["updateIntegration"]>[1]) {
    return activeProvider.updateIntegration(id, data);
  },

  async getImportExportHistory() {
    return activeProvider.getImportExportHistory();
  },

  async createImportExportHistoryItem(
    data: Parameters<PIMProvider["createImportExportHistoryItem"]>[0]
  ) {
    return activeProvider.createImportExportHistoryItem(data);
  },

  async getAnalyticsMetrics() {
    return activeProvider.getAnalyticsMetrics();
  },

  async getTeamMembers() {
    return activeProvider.getTeamMembers();
  },

  async createTeamMember(data: Parameters<PIMProvider["createTeamMember"]>[0]) {
    return activeProvider.createTeamMember(data);
  },

  async updateTeamMember(id: PimEntityId, data: Parameters<PIMProvider["updateTeamMember"]>[1]) {
    return activeProvider.updateTeamMember(id, data);
  },

  async deleteTeamMember(id: PimEntityId) {
    return activeProvider.deleteTeamMember(id);
  },
};
