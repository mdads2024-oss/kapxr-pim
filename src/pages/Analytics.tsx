import { AppLayout } from "@/components/AppLayout";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis } from "recharts";
import {
  useAnalyticsMetricsQuery,
  useAssetsQuery,
  useCategoriesQuery,
  useProductsQuery,
} from "@/hooks/usePimQueries";

const metricIcons = [FileCheck, TrendingUp, Eye, BarChart3];

export default function Analytics() {
  const { data: metrics = [], isLoading: metricsLoading } = useAnalyticsMetricsQuery();
  const { data: products = [], isLoading: productsLoading } = useProductsQuery();
  const { data: assets = [], isLoading: assetsLoading } = useAssetsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const isLoading = metricsLoading || productsLoading || assetsLoading || categoriesLoading;

  const statusData = [
    { status: "Published", count: products.filter((p) => p.status === "Published").length, fill: "hsl(var(--success))" },
    { status: "In Review", count: products.filter((p) => p.status === "In Review").length, fill: "hsl(var(--warning))" },
    { status: "Draft", count: products.filter((p) => p.status === "Draft").length, fill: "hsl(var(--muted-foreground))" },
  ];

  const completenessData = [
    { bucket: "0-49%", count: products.filter((p) => p.completeness < 50).length },
    { bucket: "50-79%", count: products.filter((p) => p.completeness >= 50 && p.completeness < 80).length },
    { bucket: "80-99%", count: products.filter((p) => p.completeness >= 80 && p.completeness < 100).length },
    { bucket: "100%", count: products.filter((p) => p.completeness === 100).length },
  ];

  const categoryData = categories.slice(0, 6).map((c) => ({ name: c.name, products: c.products }));

  if (isLoading) {
    return (
      <AppLayout title="Analytics">
        <AppLoader message="Loading analytics…" />
      </AppLayout>
    );
  }

  const trendData = [
    { month: "Jan", products: Math.max(products.length - 6, 0), assets: Math.max(assets.length - 5, 0) },
    { month: "Feb", products: Math.max(products.length - 4, 0), assets: Math.max(assets.length - 3, 0) },
    { month: "Mar", products: Math.max(products.length - 2, 0), assets: Math.max(assets.length - 2, 0) },
    { month: "Apr", products: Math.max(products.length - 1, 0), assets: Math.max(assets.length - 1, 0) },
    { month: "May", products: products.length, assets: assets.length },
  ];

  return (
    <AppLayout title="Analytics">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, index) => {
            const Icon = metricIcons[index % metricIcons.length];
            return (
            <Card key={m.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />{m.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          )})}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product and Asset Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[280px] w-full"
                config={{
                  products: { label: "Products", color: "hsl(var(--primary))" },
                  assets: { label: "Assets", color: "hsl(var(--success))" },
                }}
              >
                <LineChart data={trendData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line dataKey="products" type="monotone" stroke="var(--color-products)" strokeWidth={2} />
                  <Line dataKey="assets" type="monotone" stroke="var(--color-assets)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[280px] w-full"
                config={{
                  Published: { label: "Published", color: "hsl(var(--success))" },
                  "In Review": { label: "In Review", color: "hsl(var(--warning))" },
                  Draft: { label: "Draft", color: "hsl(var(--muted-foreground))" },
                }}
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                  <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={50} outerRadius={90}>
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Categories by Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[280px] w-full"
                config={{ products: { label: "Products", color: "hsl(var(--primary))" } }}
              >
                <BarChart data={categoryData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="products" fill="var(--color-products)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completeness Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[280px] w-full"
                config={{ count: { label: "Products", color: "hsl(var(--primary))" } }}
              >
                <BarChart data={completenessData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
}
