import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Image, FileText, Film, Upload, Search, Filter, Plus, Grid3X3, List, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const assets = [
  { id: 1, name: "hero-banner-spring.jpg", type: "Image", size: "2.4 MB", dimensions: "1920×1080", tags: ["banner", "spring"], date: "Mar 18, 2026" },
  { id: 2, name: "product-headphones-front.png", type: "Image", size: "1.1 MB", dimensions: "2000×2000", tags: ["product", "headphones"], date: "Mar 17, 2026" },
  { id: 3, name: "brand-video-2024.mp4", type: "Video", size: "48 MB", dimensions: "3840×2160", tags: ["brand", "video"], date: "Mar 15, 2026" },
  { id: 4, name: "catalog-spring-2026.pdf", type: "Document", size: "12 MB", dimensions: "–", tags: ["catalog", "pdf"], date: "Mar 14, 2026" },
  { id: 5, name: "lifestyle-office-setup.jpg", type: "Image", size: "3.8 MB", dimensions: "4000×2667", tags: ["lifestyle"], date: "Mar 12, 2026" },
  { id: 6, name: "product-keyboard-top.png", type: "Image", size: "980 KB", dimensions: "2000×2000", tags: ["product", "keyboard"], date: "Mar 10, 2026" },
  { id: 7, name: "unboxing-tutorial.mp4", type: "Video", size: "120 MB", dimensions: "1920×1080", tags: ["tutorial"], date: "Mar 8, 2026" },
  { id: 8, name: "brand-guidelines-v3.pdf", type: "Document", size: "8.2 MB", dimensions: "–", tags: ["brand", "guidelines"], date: "Mar 5, 2026" },
];

const typeIcon: Record<string, typeof Image> = {
  Image: Image,
  Video: Film,
  Document: FileText,
};

const typeColor: Record<string, string> = {
  Image: "bg-primary/10 text-primary",
  Video: "bg-success/10 text-success",
  Document: "bg-warning/10 text-warning",
};

export default function Assets() {
  return (
    <AppLayout title="Digital Assets">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assets..." className="pl-9 h-9 w-64 bg-card border" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <button className="p-2 bg-primary text-primary-foreground"><Grid3X3 className="h-4 w-4" /></button>
              <button className="p-2 hover:bg-muted transition-colors"><List className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <Button size="sm" className="h-9 gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Upload card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-0 h-48 flex flex-col items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">Drop files or click to upload</p>
            </CardContent>
          </Card>

          {assets.map((a) => {
            const Icon = typeIcon[a.type];
            return (
              <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className={`h-32 flex items-center justify-center ${typeColor[a.type]}`}>
                  <Icon className="h-10 w-10 opacity-60" />
                </div>
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate flex-1">{a.name}</p>
                    <button className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{a.size}</span>
                    <span>·</span>
                    <span>{a.dimensions}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {a.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
}
