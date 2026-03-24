import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search, Filter, Package, Trash2, Upload, Download, Edit, Plus, UserPlus, Image, FolderTree, Tags, Settings, Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { AppLoader } from "@/components/shared/AppLoader";

const iconMap: Record<string, typeof Package> = {
  create: Plus,
  delete: Trash2,
  update: Edit,
  export: Download,
  import: Upload,
  upload: Image,
  invite: UserPlus,
  settings: Settings,
};

type ActivityLog = {
  id: string;
  user_name: string;
  initials: string;
  action: string;
  entity: string;
  detail: string;
  time_label: string;
};

const actionColor: Record<string, string> = {
  create: "bg-primary/10 text-primary",
  delete: "bg-destructive/10 text-destructive",
  update: "bg-accent text-accent-foreground",
  export: "bg-secondary text-secondary-foreground",
  import: "bg-secondary text-secondary-foreground",
  upload: "bg-primary/10 text-primary",
  invite: "bg-primary/10 text-primary",
  settings: "bg-muted text-muted-foreground",
};

export default function Activity() {
  useAppPageTitle("Activity Log");
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => apiClient.get<ActivityLog[]>("/activity/logs"),
  });
  if (isLoading) return <AppLoader message="Loading activity…" />;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Track all actions performed by team members</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search activity..." className="pl-9 h-9 w-56 bg-card border" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </div>

        <Card className="pim-card-shell">
          <CardContent className="p-0 divide-y divide-border/50">
            {logs.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">No activity logs yet.</div>
            )}
            {logs.map((log) => {
              const Icon = iconMap[log.action] || Edit;
              return (
                <div key={log.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-accent/30 transition-colors">
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                      {log.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${actionColor[log.action]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold">{log.user_name}</span>{" "}
                      <span className="text-muted-foreground">{log.detail}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1 sm:hidden">{log.time_label}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-medium shrink-0">{log.entity}</Badge>
                    <span className="text-[10px] text-muted-foreground/70 hidden sm:inline text-right tabular-nums">{log.time_label}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
  );
}
