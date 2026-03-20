export interface ProductDto {
  id: number;
  name: string;
  sku: string;
  category: string;
  status: "Published" | "In Review" | "Draft";
  completeness: number;
  channels: number;
  image: string | null;
}

export interface CategoryDto {
  id: number;
  name: string;
  products: number;
  subcategories: string[];
}

export interface AssetDto {
  id: number;
  name: string;
  type: "Image" | "Video" | "Document";
  size: string;
  dimensions: string;
  tags: string[];
  date: string;
}

export interface AttributeDto {
  id: number;
  name: string;
  type: "Text" | "Rich Text" | "Number" | "Select" | "Multi-select";
  group: string;
  values: number | null;
  required: boolean;
  categories: string[];
}

export interface IntegrationDto {
  id: number;
  name: string;
  description: string;
  logo: string;
  status: "Connected" | "Not Connected";
  connected: boolean;
  category: string;
}

export interface ImportExportHistoryItemDto {
  id: number;
  name: string;
  type: "Import" | "Export";
  status: "Completed" | "Failed";
  records: number;
  date: string;
  time: string;
}

export interface AnalyticsMetricDto {
  id: number;
  label: string;
  value: string;
  change: string;
}

export interface TeamMemberDto {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  initials: string;
}
