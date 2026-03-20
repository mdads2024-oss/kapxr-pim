import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Wireless Headphones Pro", sku: "WHP-001", category: "Audio", status: "Published", completeness: 100, channels: 3, image: null },
  { id: 2, name: "USB-C Hub Adapter", sku: "UCH-042", category: "Accessories", status: "In Review", completeness: 85, channels: 2, image: null },
  { id: 3, name: "Ergonomic Keyboard", sku: "EKB-103", category: "Input Devices", status: "Draft", completeness: 45, channels: 0, image: null },
  { id: 4, name: "4K Monitor Stand", sku: "4KM-220", category: "Furniture", status: "Published", completeness: 100, channels: 4, image: null },
  { id: 5, name: "Bluetooth Speaker Mini", sku: "BSM-087", category: "Audio", status: "In Review", completeness: 72, channels: 1, image: null },
  { id: 6, name: "Mechanical Keyboard RGB", sku: "MKR-055", category: "Input Devices", status: "Draft", completeness: 30, channels: 0, image: null },
  { id: 7, name: "Webcam 4K Ultra", sku: "W4K-011", category: "Video", status: "Published", completeness: 95, channels: 3, image: null },
  { id: 8, name: "Laptop Sleeve 15\"", sku: "LS15-033", category: "Accessories", status: "Published", completeness: 100, channels: 5, image: null },
];

const statusColor: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  "In Review": "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

export default function Products() {
  const navigate = useNavigate();
  return (
    <AppLayout title="Products">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-9 h-9 w-64 bg-card border" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/products/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 w-10"><Checkbox /></th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="p-3 text-left font-medium text-muted-foreground hidden md:table-cell">SKU</th>
                    <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Category</th>
                    <th className="p-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Completeness</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Channels</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                      <td className="p-3"><Checkbox /></td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{p.sku}</td>
                      <td className="p-3 hidden lg:table-cell">{p.category}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2 w-28">
                          <Progress value={p.completeness} className="h-1.5" />
                          <span className="text-xs text-muted-foreground">{p.completeness}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${statusColor[p.status]}`}>{p.status}</Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">{p.channels}</td>
                      <td className="p-3">
                        <button className="p-1 rounded hover:bg-muted transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
