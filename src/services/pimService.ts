import { mockPimProvider } from "@/services/providers/mockPimProvider";
import type { PIMProvider } from "@/services/providers/pimProvider";

let activeProvider: PIMProvider = mockPimProvider;

export const setPimProvider = (provider: PIMProvider) => {
  activeProvider = provider;
};

export const pimService = {
  async getProducts() {
    return activeProvider.getProducts();
  },

  async getProductById(id: number) {
    return activeProvider.getProductById(id);
  },

  async createProduct(data: Parameters<PIMProvider["createProduct"]>[0]) {
    return activeProvider.createProduct(data);
  },

  async updateProduct(id: number, data: Parameters<PIMProvider["updateProduct"]>[1]) {
    return activeProvider.updateProduct(id, data);
  },

  async deleteProduct(id: number) {
    return activeProvider.deleteProduct(id);
  },

  async getCategories() {
    return activeProvider.getCategories();
  },

  async createCategory(data: Parameters<PIMProvider["createCategory"]>[0]) {
    return activeProvider.createCategory(data);
  },

  async updateCategory(id: number, data: Parameters<PIMProvider["updateCategory"]>[1]) {
    return activeProvider.updateCategory(id, data);
  },

  async deleteCategory(id: number) {
    return activeProvider.deleteCategory(id);
  },

  async getAssets() {
    return activeProvider.getAssets();
  },

  async createAsset(data: Parameters<PIMProvider["createAsset"]>[0]) {
    return activeProvider.createAsset(data);
  },

  async updateAsset(id: number, data: Parameters<PIMProvider["updateAsset"]>[1]) {
    return activeProvider.updateAsset(id, data);
  },

  async deleteAsset(id: number) {
    return activeProvider.deleteAsset(id);
  },

  async getAttributes() {
    return activeProvider.getAttributes();
  },

  async createAttribute(data: Parameters<PIMProvider["createAttribute"]>[0]) {
    return activeProvider.createAttribute(data);
  },

  async updateAttribute(id: number, data: Parameters<PIMProvider["updateAttribute"]>[1]) {
    return activeProvider.updateAttribute(id, data);
  },

  async deleteAttribute(id: number) {
    return activeProvider.deleteAttribute(id);
  },

  async getIntegrations() {
    return activeProvider.getIntegrations();
  },

  async updateIntegration(id: number, data: Parameters<PIMProvider["updateIntegration"]>[1]) {
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

  async updateTeamMember(id: number, data: Parameters<PIMProvider["updateTeamMember"]>[1]) {
    return activeProvider.updateTeamMember(id, data);
  },

  async deleteTeamMember(id: number) {
    return activeProvider.deleteTeamMember(id);
  },
};
