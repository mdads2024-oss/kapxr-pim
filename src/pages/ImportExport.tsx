import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCreateImportExportHistoryMutation, useImportExportHistoryQuery } from "@/hooks/usePimQueries";
import { useToast } from "@/hooks/use-toast";

export default function ImportExport() {
  const { toast } = useToast();
  const { data: history = [] } = useImportExportHistoryQuery();
  const createHistoryMutation = useCreateImportExportHistoryMutation();

  const addHistory = async (type: "Import" | "Export") => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    await createHistoryMutation.mutateAsync({
      name: `${type.toLowerCase()}_${Date.now()}.csv`,
      type,
      status: "Completed",
      records: Math.floor(Math.random() * 2000) + 100,
      date,
      time,
    });
    toast({ title: `${type} job created` });
  };

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
              <Button variant="outline" size="sm" onClick={() => addHistory("Import")}>Select Files</Button>
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
              <Button variant="outline" size="sm" onClick={() => addHistory("Export")}>Configure Export</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between px-6 py-3">
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
