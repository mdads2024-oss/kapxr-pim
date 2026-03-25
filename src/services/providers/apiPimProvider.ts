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

const toBrandApiPayload = (data: Record<string, unknown>) => ({
  name: data.name,
  description: data.description,
  website: data.website,
  status: data.status,
  products: data.products,
  logo: data.logo_url ?? data.logoUrl ?? data.logo ?? null,
  logo_url: data.logo_url ?? data.logoUrl ?? data.logo ?? null,
  logo_object_key: data.logo_object_key ?? data.logoObjectKey ?? null,
  logo_bucket_name: data.logo_bucket_name ?? data.logoBucketName ?? null,
  country: data.country,
  contact_email: data.contact_email ?? data.contactEmail,
  contact_phone: data.contact_phone ?? data.contactPhone,
  created_at: data.created_at ?? data.createdAt,
  updated_at: data.updated_at ?? data.updatedAt,
  created_by: data.created_by ?? data.createdBy,
});

const toAssetApiPayload = (data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = { ...data };
  if ("bucketName" in payload) {
    payload.bucket_name = payload.bucketName;
    delete payload.bucketName;
  }
  if ("objectKey" in payload) {
    payload.object_key = payload.objectKey;
    delete payload.objectKey;
  }
  return payload;
};

const toCategoryApiPayload = (data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = { ...data };
  if ("imageUrl" in payload) {
    payload.image_url = payload.imageUrl;
    delete payload.imageUrl;
  }
  if ("imageObjectKey" in payload) {
    payload.image_object_key = payload.imageObjectKey;
    delete payload.imageObjectKey;
  }
  if ("imageBucketName" in payload) {
    payload.image_bucket_name = payload.imageBucketName;
    delete payload.imageBucketName;
  }
  return payload;
};

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
    const payload = toBrandApiPayload(data as Record<string, unknown>);
    const response = await apiClient.post<BrandDto>("/brands", payload);
    return mapBrandDtoToModel(response);
  },
  async updateBrand(id, data) {
    const payload = toBrandApiPayload(data as Record<string, unknown>);
    const response = await apiClient.patch<BrandDto>(`/brands/${id}`, payload);
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
    const payload = toCategoryApiPayload(data as Record<string, unknown>);
    const response = await apiClient.post<CategoryDto>("/categories", payload);
    return mapCategoryDtoToModel(response);
  },
  async updateCategory(id, data) {
    const payload = toCategoryApiPayload(data as Record<string, unknown>);
    const response = await apiClient.patch<CategoryDto>(`/categories/${id}`, payload);
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
    const payload = toAssetApiPayload(data as Record<string, unknown>);
    const response = await apiClient.post<AssetDto>("/assets", payload);
    return mapAssetDtoToModel(response);
  },
  async updateAsset(id, data) {
    const payload = toAssetApiPayload(data as Record<string, unknown>);
    const response = await apiClient.patch<AssetDto>(`/assets/${id}`, payload);
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
  async saveProductAttributeValues(productId, values) {
    await apiClient.post(`/products/${productId}/attribute-values`, {
      values: values.map((v) => ({
        attribute_id: v.attributeId,
        value: v.value,
      })),
    });
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
