import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Data Quality Score", value: "87%", icon: FileCheck, change: "+4%" },
  { label: "Enrichment Rate", value: "72%", icon: TrendingUp, change: "+12%" },
  { label: "Asset Views", value: "24.5K", icon: Eye, change: "+18%" },
  { label: "Channel Coverage", value: "94%", icon: BarChart3, change: "+2%" },
];

export default function Analytics() {
  return (
    <AppLayout title="Analytics">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    <m.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />{m.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Charts and detailed analytics will appear here</p>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
