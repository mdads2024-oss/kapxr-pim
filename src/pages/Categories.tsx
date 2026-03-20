import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Plus, Search, ChevronRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Audio", products: 342, subcategories: ["Headphones", "Speakers", "Microphones", "Amplifiers"] },
  { name: "Input Devices", products: 218, subcategories: ["Keyboards", "Mice", "Trackpads", "Styluses"] },
  { name: "Video", products: 156, subcategories: ["Webcams", "Monitors", "Projectors"] },
  { name: "Accessories", products: 498, subcategories: ["Cables", "Adapters", "Cases", "Stands"] },
  { name: "Furniture", products: 89, subcategories: ["Desks", "Chairs", "Monitor Arms"] },
  { name: "Storage", products: 134, subcategories: ["External Drives", "USB Flash", "SD Cards"] },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Categories">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." className="pl-9 h-9 w-64 bg-card border" />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/categories/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Card key={c.name} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <FolderTree className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{c.name}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{c.products} products</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {c.subcategories.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
}
