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

const logs = [
  { id: 1, user: "Arjun M.", initials: "AM", action: "create", entity: "Product", detail: 'Created product "Wireless Keyboard Pro"', time: "2 min ago" },
  { id: 2, user: "Priya S.", initials: "PS", action: "export", entity: "Products", detail: "Exported 142 products as CSV", time: "18 min ago" },
  { id: 3, user: "Arjun M.", initials: "AM", action: "upload", entity: "Asset", detail: "Uploaded 5 images to product gallery", time: "35 min ago" },
  { id: 4, user: "Rahul K.", initials: "RK", action: "delete", entity: "Product", detail: 'Deleted product "Old Monitor Stand"', time: "1 hour ago" },
  { id: 5, user: "Priya S.", initials: "PS", action: "update", entity: "Category", detail: 'Updated category "Electronics > Audio"', time: "1.5 hours ago" },
  { id: 6, user: "Arjun M.", initials: "AM", action: "create", entity: "Brand", detail: 'Created brand "SoundWave Audio"', time: "2 hours ago" },
  { id: 7, user: "Rahul K.", initials: "RK", action: "update", entity: "Attribute", detail: 'Added attribute value "Rose Gold" to Color', time: "3 hours ago" },
  { id: 8, user: "Priya S.", initials: "PS", action: "import", entity: "Products", detail: "Imported 56 products from Shopify", time: "4 hours ago" },
  { id: 9, user: "Arjun M.", initials: "AM", action: "invite", entity: "Team", detail: "Invited neha@kapxr.com as Editor", time: "5 hours ago" },
  { id: 10, user: "Rahul K.", initials: "RK", action: "settings", entity: "Settings", detail: "Updated default currency to INR", time: "6 hours ago" },
  { id: 11, user: "Priya S.", initials: "PS", action: "delete", entity: "Asset", detail: "Deleted 3 unused banner images", time: "8 hours ago" },
  { id: 12, user: "Arjun M.", initials: "AM", action: "create", entity: "Product", detail: 'Created product "USB-C Hub 7-in-1"', time: "Yesterday" },
];

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
                      <span className="font-semibold">{log.user}</span>{" "}
                      <span className="text-muted-foreground">{log.detail}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1 sm:hidden">{log.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-medium shrink-0">{log.entity}</Badge>
                    <span className="text-[10px] text-muted-foreground/70 hidden sm:inline text-right tabular-nums">{log.time}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
  );
}
