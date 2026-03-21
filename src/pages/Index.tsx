import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Image,
  FolderTree,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Upload,
  Building2,
  Tags,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Plus,
  Edit,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  useAssetsQuery,
  useAttributesQuery,
  useBrandsQuery,
  useCategoriesQuery,
  useProductsQuery,
  useTeamMembersQuery,
} from "@/hooks/usePimQueries";
import { toParamSlug } from "@/lib/slug";

const brandStatusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
};

const attributeTypeBadge: Record<string, string> = {
  Select: "bg-primary/10 text-primary border-primary/20",
  "Multi-select": "bg-success/10 text-success border-success/20",
  Text: "bg-accent text-accent-foreground",
  Number: "bg-warning/10 text-warning border-warning/20",
  "Rich Text": "bg-destructive/10 text-destructive border-destructive/20",
};

const RECENT_LIST_SIZE = 3;

const statusColor: Record<string, string> = {
  Complete: "bg-success/10 text-success border-success/30",
  Published: "bg-success/10 text-success border-success/30",
  "In Review": "bg-warning/10 text-warning border-warning/30",
  Draft: "bg-muted text-muted-foreground border-border",
};

/** Visual accents aligned with demo dashboard stat cards */
const statAccents = {
  products: "from-primary/20 to-primary/5 text-primary",
  assets: "from-[hsl(262,80%,50%)]/20 to-[hsl(262,80%,50%)]/5 text-[hsl(262,80%,50%)]",
  team: "from-[hsl(190,80%,42%)]/20 to-[hsl(190,80%,42%)]/5 text-[hsl(190,80%,42%)]",
  categories: "from-success/20 to-success/5 text-success",
  attributes: "from-warning/20 to-warning/5 text-warning",
  incomplete: "from-destructive/20 to-destructive/5 text-destructive",
} as const;

const quickLinks = [
  { label: "Add Product", icon: Package, url: "/products/new" },
  { label: "Upload Assets", icon: Upload, url: "/assets" },
  { label: "Create New Brand", icon: Building2, url: "/brands/new" },
  { label: "Create New Category", icon: FolderTree, url: "/categories/new" },
  { label: "Create New Attribute", icon: Tags, url: "/attributes/new" },
];

/** Preview feed (RECENT_LIST_SIZE items) — full log on /activity */
const activityPreview = [
  { user: "Arjun M.", action: "create" as const, detail: 'Created product "Wireless Keyboard Pro"', time: "2 min ago", icon: Plus },
  { user: "Priya S.", action: "export" as const, detail: "Exported 142 products as CSV", time: "18 min ago", icon: Download },
  { user: "Rahul K.", action: "update" as const, detail: 'Updated category "Electronics > Audio"', time: "1 hour ago", icon: Edit },
];

const actionIconBg: Record<string, string> = {
  create: "bg-success/10 text-success",
  export: "bg-primary/10 text-primary",
  update: "bg-warning/10 text-warning",
  delete: "bg-destructive/10 text-destructive",
  upload: "bg-accent text-accent-foreground",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function parseAccent(accent: string) {
  const parts = accent.trim().split(/\s+/);
  return {
    gradientFrom: parts[0] ?? "",
    gradientTo: parts[1] ?? "",
    iconText: parts[2] ?? "",
  };
}

export default function Index() {
  useAppPageTitle("Dashboard");
  const navigate = useNavigate();
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: assets = [], isLoading: assetsLoading } = useAssetsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const { data: attributes = [], isLoading: attributesLoading } = useAttributesQuery();
  const { data: teamMembers = [], isLoading: teamLoading } = useTeamMembersQuery();
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery();

  const isLoading =
    productsLoading ||
    assetsLoading ||
    categoriesLoading ||
    attributesLoading ||
    teamLoading ||
    brandsLoading;

  const recentBrands = useMemo(() => brands.slice(0, RECENT_LIST_SIZE), [brands]);

  const incompleteCount = products.filter((p) => p.completeness < 100).length;

  const stats = useMemo(
    () => [
      {
        label: "Total Products",
        value: products.length.toLocaleString(),
        icon: Package,
        change: "+12%",
        trend: "up" as const,
        accent: statAccents.products,
      },
      {
        label: "Assets",
        value: assets.length.toLocaleString(),
        icon: Image,
        change: "+8%",
        trend: "up" as const,
        accent: statAccents.assets,
      },
      {
        label: "Team",
        value: teamMembers.length.toLocaleString(),
        icon: Building2,
        change: "+2",
        trend: "up" as const,
        accent: statAccents.team,
      },
      {
        label: "Categories",
        value: categories.length.toLocaleString(),
        icon: FolderTree,
        change: "+3",
        trend: "up" as const,
        accent: statAccents.categories,
      },
      {
        label: "Attributes",
        value: attributes.length.toLocaleString(),
        icon: Tags,
        change: "+5",
        trend: "up" as const,
        accent: statAccents.attributes,
      },
      {
        label: "Incomplete",
        value: incompleteCount.toLocaleString(),
        icon: AlertTriangle,
        change: "-15%",
        trend: "down" as const,
        accent: statAccents.incomplete,
      },
    ],
    [products.length, assets.length, teamMembers.length, categories.length, attributes.length, incompleteCount]
  );

  const recentProducts = products.slice(0, RECENT_LIST_SIZE).map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    status: p.status === "Published" ? "Complete" : p.status,
    completeness: p.completeness,
  }));

  const recentAssets = assets.slice(0, RECENT_LIST_SIZE).map((a) => ({
    name: a.name,
    type: a.type,
    size: a.size,
    date: a.date,
  }));

  const recentCategories = categories.slice(0, RECENT_LIST_SIZE);
  const recentAttributes = attributes.slice(0, RECENT_LIST_SIZE);

  if (isLoading) {
    return <AppLoader message="Loading dashboard…" />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Welcome + Quick Actions (demo-aligned) */}
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back 👋</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here&apos;s what&apos;s happening with your product catalog.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {quickLinks.map((q) => (
              <Button
                key={q.label}
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs rounded-lg border-border/60 hover:bg-accent hover:text-accent-foreground transition-all"
                onClick={() => navigate(q.url)}
              >
                <q.icon className="h-3.5 w-3.5" />
                {q.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Stats grid (demo card styling + live counts) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => {
            const { gradientFrom, gradientTo, iconText } = parseAccent(s.accent);
            return (
              <motion.div key={s.label} variants={item}>
                <Card className="group relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 cursor-default">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-60`}
                  />
                  <CardContent className="relative p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}
                      >
                        <s.icon className={`h-4 w-4 ${iconText}`} />
                      </div>
                      <span
                        className={`text-[11px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                          s.trend === "up" ? "text-success bg-success/10" : "text-warning bg-warning/10"
                        }`}
                      >
                        <TrendingUp className={`h-3 w-3 ${s.trend === "down" ? "rotate-180" : ""}`} />
                        {s.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Three equal columns — stretch so card bottoms align; compact product rows match other cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          {/* Recent Products */}
          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Products</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/products")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {recentProducts.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No products yet.</p>
                  ) : (
                    recentProducts.map((p) => (
                      <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        className="group flex items-start justify-between gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/products/${p.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/products/${p.id}`);
                          }
                        }}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Package className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs leading-relaxed group-hover:[&>span:first-child]:text-primary transition-colors">
                              <span className="font-semibold">{p.name}</span>{" "}
                              <span className="text-muted-foreground">
                                {p.sku} · {p.category}
                              </span>
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1">{p.completeness}% complete</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-start gap-2 pt-0.5">
                          <Badge variant="outline" className={`text-[10px] font-medium ${statusColor[p.status]}`}>
                            {p.status}
                          </Badge>
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <BarChart3 className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Activity</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/activity")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {activityPreview.slice(0, RECENT_LIST_SIZE).map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={`${a.user}-${a.time}-${i}`}
                        type="button"
                        className="flex w-full items-start gap-3 px-6 py-3.5 text-left hover:bg-accent/30 transition-colors"
                        onClick={() => navigate("/activity")}
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${actionIconBg[a.action]}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed">
                            <span className="font-semibold">{a.user}</span>{" "}
                            <span className="text-muted-foreground">{a.detail}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">{a.time}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Assets */}
          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Image className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Assets</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/assets")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {recentAssets.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No assets yet.</p>
                  ) : (
                    recentAssets.map((a) => (
                      <div
                        key={a.name}
                        className="flex items-start gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => navigate("/assets")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate("/assets");
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                          {a.type === "Image" ? (
                            <Image className="h-3.5 w-3.5 text-accent-foreground" />
                          ) : a.type === "Video" ? (
                            <Upload className="h-3.5 w-3.5 text-accent-foreground" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5 text-accent-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed">
                            <span className="font-semibold">{a.name}</span>{" "}
                            <span className="text-muted-foreground">
                              {a.type} · {a.size}
                            </span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            {a.date}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Brands, Categories, Attributes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Brands</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/brands")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {recentBrands.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No brands yet.</p>
                  ) : (
                    recentBrands.map((b) => (
                      <div
                        key={b.id}
                        role="button"
                        tabIndex={0}
                        className="group flex items-start justify-between gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/brands/${b.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/brands/${b.id}`);
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed">
                            <span className="font-semibold">{b.name}</span>{" "}
                            <span className="text-muted-foreground">{b.products} products</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">Brand workspace</p>
                        </div>
                        <div className="flex items-start shrink-0 pt-0.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium ${brandStatusColor[b.status]}`}
                          >
                            {b.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <FolderTree className="h-4 w-4 text-success" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Categories</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/categories")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {recentCategories.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No categories yet.</p>
                  ) : (
                    recentCategories.map((c) => (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        className="group flex items-start gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/categories/${toParamSlug(c.name)}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/categories/${toParamSlug(c.name)}`);
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                          <FolderTree className="h-3.5 w-3.5 text-success" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed group-hover:[&>span:first-child]:text-primary transition-colors">
                            <span className="font-semibold">{c.name}</span>{" "}
                            <span className="text-muted-foreground">
                              {c.products} products · {c.subcategories.length} subcats
                            </span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">Taxonomy</p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="min-w-0 flex h-full">
            <Card className="border-border/50 flex h-full min-h-0 w-full flex-col">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                      <Tags className="h-4 w-4 text-warning" />
                    </div>
                    <CardTitle className="text-base font-semibold truncate">Recent Attributes</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => navigate("/attributes")}
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 min-h-0">
                <div className="divide-y divide-border/50 flex flex-1 flex-col">
                  {recentAttributes.length === 0 ? (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No attributes yet.</p>
                  ) : (
                    recentAttributes.map((attr) => (
                      <div
                        key={attr.id}
                        role="button"
                        tabIndex={0}
                        className="group flex items-start justify-between gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/attributes/${toParamSlug(attr.name)}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/attributes/${toParamSlug(attr.name)}`);
                          }
                        }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Tags className="h-3.5 w-3.5 text-warning" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed group-hover:[&>span:first-child]:text-primary transition-colors">
                            <span className="font-semibold">{attr.name}</span>{" "}
                            <span className="text-muted-foreground">{attr.group}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">
                            {attr.required ? "Required" : "Optional"} ·{" "}
                            {attr.categories.length > 0
                              ? `${attr.categories.length} categor${attr.categories.length === 1 ? "y" : "ies"}`
                              : "All categories"}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 shrink-0 pt-0.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium ${attributeTypeBadge[attr.type] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {attr.type}
                          </Badge>
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
  );
}
