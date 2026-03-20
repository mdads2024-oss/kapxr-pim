import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Image, FolderTree, AlertTriangle, TrendingUp, Clock, CheckCircle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useAssetsQuery,
  useCategoriesQuery,
  useProductsQuery,
} from "@/hooks/usePimQueries";

const statusColor: Record<string, string> = {
  Complete: "bg-success/10 text-success border-success/20",
  "In Review": "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function Index() {
  const navigate = useNavigate();
  const { data: products = [] } = useProductsQuery();
  const { data: assets = [] } = useAssetsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const incompleteCount = products.filter((p) => p.completeness < 100).length;
  const stats = [
    { label: "Total Products", value: products.length.toLocaleString(), icon: Package, change: "+12%", trend: "up" },
    { label: "Digital Assets", value: assets.length.toLocaleString(), icon: Image, change: "+8%", trend: "up" },
    { label: "Categories", value: categories.length.toLocaleString(), icon: FolderTree, change: "+3", trend: "up" },
    { label: "Incomplete Items", value: incompleteCount.toLocaleString(), icon: AlertTriangle, change: "-15%", trend: "down" },
  ];

  const recentProducts = products.slice(0, 5).map((p) => ({
    name: p.name,
    sku: p.sku,
    status: p.status === "Published" ? "Complete" : p.status,
    completeness: p.completeness,
  }));
  const recentAssets = assets.slice(0, 4).map((a) => ({
    name: a.name,
    type: a.type,
    size: a.size,
    date: a.date,
  }));

  return (
    <AppLayout title="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div key={s.label} variants={item}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-1 ${s.trend === "up" ? "text-success" : "text-warning"}`}>
                      <TrendingUp className={`h-3 w-3 ${s.trend === "down" ? "rotate-180" : ""}`} />
                      {s.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Products */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Products</CardTitle>
                  <button onClick={() => navigate("/products")}>
                    <Badge variant="secondary" className="font-normal hover:bg-secondary/80 transition-colors">
                      View all
                    </Badge>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentProducts.map((p) => (
                    <div key={p.sku} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 w-32">
                          <Progress value={p.completeness} className="h-1.5" />
                          <span className="text-xs text-muted-foreground w-8">{p.completeness}%</span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${statusColor[p.status]}`}>
                          {p.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Assets */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Assets</CardTitle>
                  <button onClick={() => navigate("/assets")}>
                    <Badge variant="secondary" className="font-normal hover:bg-secondary/80 transition-colors">
                      View all
                    </Badge>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentAssets.map((a) => (
                    <div key={a.name} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center shrink-0">
                        {a.type === "Image" ? <Image className="h-4 w-4 text-accent-foreground" /> :
                         a.type === "Video" ? <Upload className="h-4 w-4 text-accent-foreground" /> :
                         <CheckCircle className="h-4 w-4 text-accent-foreground" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{a.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{a.size}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{a.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
