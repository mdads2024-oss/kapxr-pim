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

export const mapProductDtoToModel = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  sku: dto.sku,
  category: dto.category,
  brand: dto.brand ?? "",
  status: dto.status,
  completeness: dto.completeness,
  channels: dto.channels,
  image: dto.image,
});

export const mapCategoryDtoToModel = (dto: CategoryDto): Category => ({
  id: dto.id,
  name: dto.name,
  products: dto.products,
  subcategories: dto.subcategories,
  imageUrl: dto.image_url ?? null,
  imageObjectKey: dto.image_object_key ?? null,
  imageBucketName: dto.image_bucket_name ?? null,
});

export const mapBrandDtoToModel = (dto: BrandDto): Brand => ({
  id: dto.id,
  uuid: dto.uuid ?? dto.id,
  name: dto.name,
  description: dto.description,
  website: dto.website,
  status: dto.status,
  products: dto.products,
  logo: dto.logo_url ?? dto.logo ?? null,
  logoUrl: dto.logo_url ?? dto.logo ?? null,
  logoObjectKey: dto.logo_object_key ?? null,
  logoBucketName: dto.logo_bucket_name ?? null,
  contactEmail: dto.contactEmail ?? dto.contact_email ?? "",
  contactPhone: dto.contactPhone ?? dto.contact_phone ?? "",
  country: dto.country ?? "",
  createdAt: dto.createdAt ?? dto.created_at ?? "",
  updatedAt: dto.updatedAt ?? dto.updated_at ?? "",
  createdBy: dto.createdBy ?? dto.created_by ?? "system",
});

export const mapAssetDtoToModel = (dto: AssetDto): Asset => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  size: dto.size,
  dimensions: dto.dimensions,
  tags: dto.tags,
  date: dto.date,
  bucketName: dto.bucket_name ?? null,
  objectKey: dto.object_key ?? null,
  url: dto.url ?? null,
});

export const mapAttributeDtoToModel = (dto: AttributeDto): Attribute => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  group: dto.group,
  values: dto.values,
  required: dto.required,
  categories: dto.categories,
  options: dto.options ?? [],
});

export const mapIntegrationDtoToModel = (dto: IntegrationDto): Integration => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  logo: dto.logo,
  status: dto.status,
  connected: dto.connected,
  category: dto.category,
});

export const mapImportExportHistoryDtoToModel = (
  dto: ImportExportHistoryItemDto
): ImportExportHistoryItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  status: dto.status,
  records: dto.records,
  date: dto.date,
  time: dto.time,
});

export const mapAnalyticsMetricDtoToModel = (dto: AnalyticsMetricDto): AnalyticsMetric => ({
  id: dto.id,
  label: dto.label,
  value: dto.value,
  change: dto.change,
});

export const mapTeamMemberDtoToModel = (dto: TeamMemberDto): TeamMember => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  role: dto.role,
  status: dto.status,
  initials: dto.initials,
});
