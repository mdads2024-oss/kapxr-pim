import type {
  AnalyticsMetricDto,
  AssetDto,
  AttributeDto,
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
});

export const mapAssetDtoToModel = (dto: AssetDto): Asset => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  size: dto.size,
  dimensions: dto.dimensions,
  tags: dto.tags,
  date: dto.date,
});

export const mapAttributeDtoToModel = (dto: AttributeDto): Attribute => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  group: dto.group,
  values: dto.values,
  required: dto.required,
  categories: dto.categories,
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
