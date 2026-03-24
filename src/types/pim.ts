export type PimEntityId = string;

export interface Product {
  id: PimEntityId;
  name: string;
  sku: string;
  category: string;
  status: "Published" | "In Review" | "Draft";
  completeness: number;
  channels: number;
  image: string | null;
}

export interface Asset {
  id: PimEntityId;
  name: string;
  type: "Image" | "Video" | "Document";
  size: string;
  dimensions: string;
  tags: string[];
  date: string;
}

export interface Brand {
  id: PimEntityId;
  uuid: string;
  name: string;
  description: string;
  website: string;
  status: "Active" | "Inactive";
  products: number;
  logo: string | null;
  contactEmail: string;
  contactPhone: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Category {
  id: PimEntityId;
  name: string;
  products: number;
  subcategories: string[];
}

export interface Attribute {
  id: PimEntityId;
  name: string;
  type: "Text" | "Rich Text" | "Number" | "Select" | "Multi-select";
  group: string;
  values: number | null;
  required: boolean;
  categories: string[];
}

export interface Integration {
  id: PimEntityId;
  name: string;
  description: string;
  logo: string;
  status: "Connected" | "Not Connected";
  connected: boolean;
  category: string;
}

export interface ImportExportHistoryItem {
  id: PimEntityId;
  name: string;
  type: "Import" | "Export";
  status: "Completed" | "Failed";
  records: number;
  date: string;
  time: string;
}

export interface TeamMember {
  id: PimEntityId;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  initials: string;
}

export interface AnalyticsMetric {
  id: PimEntityId;
  label: string;
  value: string;
  change: string;
}
