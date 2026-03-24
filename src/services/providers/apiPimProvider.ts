import type { PIMProvider } from "@/services/providers/pimProvider";
import { apiClient } from "@/services/api/client";
import type {
  AnalyticsMetricDto,
  AssetDto,
  AttributeDto,
  BrandDto,
  CategoryDto,
  ImportExportHistoryItemDto,
  IntegrationDto,
  ProductDto,
  TeamMemberDto,
} from "@/services/api/dto";
import {
  mapAnalyticsMetricDtoToModel,
  mapAssetDtoToModel,
  mapAttributeDtoToModel,
  mapBrandDtoToModel,
  mapCategoryDtoToModel,
  mapImportExportHistoryDtoToModel,
  mapIntegrationDtoToModel,
  mapProductDtoToModel,
  mapTeamMemberDtoToModel,
} from "@/services/api/mappers";

export const apiPimProvider: PIMProvider = {
  async getProducts() {
    const response = await apiClient.get<ProductDto[]>("/products");
    return response.map(mapProductDtoToModel);
  },
  async getProductById(id) {
    const response = await apiClient.get<ProductDto>(`/products/${id}`);
    return mapProductDtoToModel(response);
  },
  async createProduct(data) {
    const response = await apiClient.post<ProductDto>("/products", data);
    return mapProductDtoToModel(response);
  },
  async updateProduct(id, data) {
    const response = await apiClient.patch<ProductDto>(`/products/${id}`, data);
    return mapProductDtoToModel(response);
  },
  async deleteProduct(id) {
    await apiClient.delete(`/products/${id}`);
    return true;
  },
  async getBrands() {
    const response = await apiClient.get<BrandDto[]>("/brands");
    return response.map(mapBrandDtoToModel);
  },
  async getBrandById(id) {
    const response = await apiClient.get<BrandDto>(`/brands/${id}`);
    return mapBrandDtoToModel(response);
  },
  async createBrand(data) {
    const response = await apiClient.post<BrandDto>("/brands", data);
    return mapBrandDtoToModel(response);
  },
  async updateBrand(id, data) {
    const response = await apiClient.patch<BrandDto>(`/brands/${id}`, data);
    return mapBrandDtoToModel(response);
  },
  async deleteBrand(id) {
    await apiClient.delete(`/brands/${id}`);
    return true;
  },
  async getCategories() {
    const response = await apiClient.get<CategoryDto[]>("/categories");
    return response.map(mapCategoryDtoToModel);
  },
  async createCategory(data) {
    const response = await apiClient.post<CategoryDto>("/categories", data);
    return mapCategoryDtoToModel(response);
  },
  async updateCategory(id, data) {
    const response = await apiClient.patch<CategoryDto>(`/categories/${id}`, data);
    return mapCategoryDtoToModel(response);
  },
  async deleteCategory(id) {
    await apiClient.delete(`/categories/${id}`);
    return true;
  },
  async getAssets() {
    const response = await apiClient.get<AssetDto[]>("/assets");
    return response.map(mapAssetDtoToModel);
  },
  async createAsset(data) {
    const response = await apiClient.post<AssetDto>("/assets", data);
    return mapAssetDtoToModel(response);
  },
  async updateAsset(id, data) {
    const response = await apiClient.patch<AssetDto>(`/assets/${id}`, data);
    return mapAssetDtoToModel(response);
  },
  async deleteAsset(id) {
    await apiClient.delete(`/assets/${id}`);
    return true;
  },
  async getAttributes() {
    const response = await apiClient.get<AttributeDto[]>("/attributes");
    return response.map(mapAttributeDtoToModel);
  },
  async createAttribute(data) {
    const response = await apiClient.post<AttributeDto>("/attributes", data);
    return mapAttributeDtoToModel(response);
  },
  async updateAttribute(id, data) {
    const response = await apiClient.patch<AttributeDto>(`/attributes/${id}`, data);
    return mapAttributeDtoToModel(response);
  },
  async deleteAttribute(id) {
    await apiClient.delete(`/attributes/${id}`);
    return true;
  },
  async getIntegrations() {
    const response = await apiClient.get<IntegrationDto[]>("/integrations");
    return response.map(mapIntegrationDtoToModel);
  },
  async updateIntegration(id, data) {
    const response = await apiClient.patch<IntegrationDto>(`/integrations/${id}`, data);
    return mapIntegrationDtoToModel(response);
  },
  async getImportExportHistory() {
    const response = await apiClient.get<ImportExportHistoryItemDto[]>("/import-export/history");
    return response.map(mapImportExportHistoryDtoToModel);
  },
  async createImportExportHistoryItem(data) {
    const response = await apiClient.post<ImportExportHistoryItemDto>("/import-export/history", data);
    return mapImportExportHistoryDtoToModel(response);
  },
  async getAnalyticsMetrics() {
    const response = await apiClient.get<AnalyticsMetricDto[]>("/analytics/metrics");
    return response.map(mapAnalyticsMetricDtoToModel);
  },
  async getTeamMembers() {
    const response = await apiClient.get<TeamMemberDto[]>("/team/members");
    return response.map(mapTeamMemberDtoToModel);
  },
  async createTeamMember(data) {
    const response = await apiClient.post<TeamMemberDto>("/team/members", data);
    return mapTeamMemberDtoToModel(response);
  },
  async updateTeamMember(id, data) {
    const response = await apiClient.patch<TeamMemberDto>(`/team/members/${id}`, data);
    return mapTeamMemberDtoToModel(response);
  },
  async deleteTeamMember(id) {
    await apiClient.delete(`/team/members/${id}`);
    return true;
  },
};
