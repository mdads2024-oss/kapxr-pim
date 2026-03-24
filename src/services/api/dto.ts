export interface ProductDto {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: "Published" | "In Review" | "Draft";
  completeness: number;
  channels: number;
  image: string | null;
}

export interface CategoryDto {
  id: string;
  name: string;
  products: number;
  subcategories: string[];
}

export interface BrandDto {
  id: string;
  uuid?: string;
  name: string;
  description: string;
  website: string;
  status: "Active" | "Inactive";
  products: number;
  logo: string | null;
  logo_url?: string | null;
  logo_object_key?: string | null;
  logo_bucket_name?: string | null;
  contact_email?: string;
  contact_phone?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface AssetDto {
  id: string;
  name: string;
  type: "Image" | "Video" | "Document";
  size: string;
  dimensions: string;
  tags: string[];
  date: string;
}

export interface AttributeDto {
  id: string;
  name: string;
  type: "Text" | "Rich Text" | "Number" | "Select" | "Multi-select";
  group: string;
  values: number | null;
  required: boolean;
  categories: string[];
}

export interface IntegrationDto {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: "Connected" | "Not Connected";
  connected: boolean;
  category: string;
}

export interface ImportExportHistoryItemDto {
  id: string;
  name: string;
  type: "Import" | "Export";
  status: "Completed" | "Failed";
  records: number;
  date: string;
  time: string;
}

export interface AnalyticsMetricDto {
  id: string;
  label: string;
  value: string;
  change: string;
}

export interface TeamMemberDto {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  initials: string;
}
