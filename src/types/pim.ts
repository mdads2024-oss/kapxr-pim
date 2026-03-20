export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  status: "Published" | "In Review" | "Draft";
  completeness: number;
  channels: number;
  image: string | null;
}

export interface Asset {
  id: number;
  name: string;
  type: "Image" | "Video" | "Document";
  size: string;
  dimensions: string;
  tags: string[];
  date: string;
}

export interface Category {
  id: number;
  name: string;
  products: number;
  subcategories: string[];
}

export interface Attribute {
  id: number;
  name: string;
  type: "Text" | "Rich Text" | "Number" | "Select" | "Multi-select";
  group: string;
  values: number | null;
  required: boolean;
  categories: string[];
}

export interface Integration {
  id: number;
  name: string;
  description: string;
  logo: string;
  status: "Connected" | "Not Connected";
  connected: boolean;
  category: string;
}

export interface ImportExportHistoryItem {
  id: number;
  name: string;
  type: "Import" | "Export";
  status: "Completed" | "Failed";
  records: number;
  date: string;
  time: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited";
  initials: string;
}

export interface AnalyticsMetric {
  id: number;
  label: string;
  value: string;
  change: string;
}
