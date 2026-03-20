import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tags, Plus, Search, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const attributes = [
  { name: "Product Name", type: "Text", group: "Basic Information", values: null, required: true, categories: ["Audio", "Input Devices", "Video", "Accessories", "Furniture", "Storage"] },
  { name: "SKU", type: "Text", group: "Basic Information", values: null, required: true, categories: ["Audio", "Input Devices", "Video", "Accessories", "Furniture", "Storage"] },
  { name: "Short Description", type: "Text", group: "Basic Information", values: null, required: true, categories: ["Audio", "Input Devices", "Video", "Accessories"] },
  { name: "Long Description", type: "Rich Text", group: "Basic Information", values: null, required: false, categories: ["Audio", "Input Devices", "Video"] },
  { name: "Brand", type: "Text", group: "Organization", values: null, required: true, categories: ["Audio", "Input Devices", "Video", "Accessories"] },
  { name: "Category", type: "Select", group: "Organization", values: 5, required: false, categories: [] },
  { name: "Price (USD)", type: "Number", group: "Pricing & Inventory", values: null, required: true, categories: ["Audio", "Input Devices", "Video", "Accessories", "Furniture", "Storage"] },
  { name: "Compare at Price", type: "Number", group: "Pricing & Inventory", values: null, required: false, categories: ["Audio", "Input Devices", "Accessories"] },
  { name: "Barcode / EAN", type: "Text", group: "Pricing & Inventory", values: null, required: false, categories: ["Audio", "Input Devices", "Accessories", "Storage"] },
  { name: "Weight", type: "Number", group: "Physical Details", values: null, required: false, categories: ["Audio", "Input Devices", "Accessories", "Furniture"] },
  { name: "Dimensions", type: "Text", group: "Physical Details", values: null, required: false, categories: ["Audio", "Furniture", "Storage"] },
  { name: "Material", type: "Multi-select", group: "Physical Details", values: 18, required: false, categories: ["Audio", "Input Devices", "Furniture"] },
  { name: "Color", type: "Select", group: "Physical Details", values: 24, required: false, categories: ["Audio", "Input Devices", "Accessories", "Furniture"] },
  { name: "Connectivity", type: "Multi-select", group: "Technical Specs", values: 6, required: false, categories: ["Audio", "Input Devices"] },
  { name: "Battery Life", type: "Text", group: "Technical Specs", values: null, required: false, categories: ["Audio", "Input Devices"] },
  { name: "Noise Cancellation", type: "Select", group: "Technical Specs", values: 3, required: false, categories: ["Audio"] },
  { name: "Driver Size", type: "Text", group: "Technical Specs", values: null, required: false, categories: ["Audio"] },
  { name: "Frequency Response", type: "Text", group: "Technical Specs", values: null, required: false, categories: ["Audio"] },
  { name: "Impedance", type: "Text", group: "Technical Specs", values: null, required: false, categories: ["Audio"] },
  { name: "Waterproof Rating", type: "Select", group: "Technical Specs", values: 5, required: false, categories: ["Audio", "Input Devices"] },
  { name: "Warranty", type: "Select", group: "Technical Specs", values: 4, required: false, categories: ["Audio", "Input Devices", "Video", "Accessories", "Furniture", "Storage"] },
  { name: "Tags", type: "Multi-select", group: "Organization", values: null, required: false, categories: [] },
  { name: "Status", type: "Select", group: "Visibility", values: 3, required: true, categories: [] },
];

const typeColor: Record<string, string> = {
  Select: "bg-primary/10 text-primary",
  "Multi-select": "bg-success/10 text-success",
  Text: "bg-accent text-accent-foreground",
  Number: "bg-warning/10 text-warning",
  "Rich Text": "bg-destructive/10 text-destructive",
};

export default function Attributes() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Attributes">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search attributes..." className="pl-9 h-9 w-64 bg-card border" />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/attributes/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Attribute
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium text-muted-foreground">Attribute</th>
                  <th className="p-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                  <th className="p-3 text-left font-medium text-muted-foreground hidden md:table-cell">Group</th>
                  <th className="p-3 text-left font-medium text-muted-foreground hidden md:table-cell">Categories</th>
                  <th className="p-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Values</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Required</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((a) => (
                  <tr key={a.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                          <Tags className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <span className="font-medium">{a.name}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge variant="secondary" className={`text-[10px] ${typeColor[a.type]}`}>{a.type}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{a.group}</td>
                    <td className="p-3 hidden md:table-cell">
                      {a.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {a.categories.slice(0, 2).map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px] font-normal">{c}</Badge>
                          ))}
                          {a.categories.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{a.categories.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">All</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{a.values ?? "–"}</td>
                    <td className="p-3">
                      {a.required ? (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Required</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Optional</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
