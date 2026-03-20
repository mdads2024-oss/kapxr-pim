import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const history = [
  { name: "products_export_mar18.csv", type: "Export", status: "Completed", records: 2847, date: "Mar 18, 2026", time: "14:32" },
  { name: "assets_import_batch.zip", type: "Import", status: "Completed", records: 156, date: "Mar 17, 2026", time: "09:15" },
  { name: "catalog_update.xlsx", type: "Import", status: "Failed", records: 0, date: "Mar 16, 2026", time: "16:45" },
  { name: "channel_data_amazon.csv", type: "Export", status: "Completed", records: 1203, date: "Mar 15, 2026", time: "11:20" },
];

export default function ImportExport() {
  return (
    <AppLayout title="Import / Export">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-8 flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Upload className="h-7 w-7 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold">Import Data</h3>
                <p className="text-sm text-muted-foreground">Upload CSV, XLSX, or JSON files</p>
              </div>
              <Button variant="outline" size="sm">Select Files</Button>
            </CardContent>
          </Card>
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-8 flex flex-col items-center text-center gap-3">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Download className="h-7 w-7 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-muted-foreground">Download products, assets, or catalogs</p>
              </div>
              <Button variant="outline" size="sm">Configure Export</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{h.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{h.date} at {h.time}</span>
                        {h.records > 0 && <span>· {h.records.toLocaleString()} records</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${h.type === "Import" ? "bg-primary/10 text-primary border-primary/20" : "bg-accent text-accent-foreground"}`}>
                      {h.type}
                    </Badge>
                    {h.status === "Completed" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
