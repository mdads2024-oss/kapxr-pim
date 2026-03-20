import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const members = [
  { name: "Kapil Sharma", email: "kapil@kapxr.com", role: "Admin", status: "Active", initials: "KS" },
  { name: "Priya Patel", email: "priya@kapxr.com", role: "Editor", status: "Active", initials: "PP" },
  { name: "Raj Kumar", email: "raj@kapxr.com", role: "Viewer", status: "Active", initials: "RK" },
  { name: "Sarah Chen", email: "sarah@kapxr.com", role: "Editor", status: "Invited", initials: "SC" },
];

const roleColor: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Editor: "bg-success/10 text-success border-success/20",
  Viewer: "bg-muted text-muted-foreground",
};

export default function Team() {
  return (
    <AppLayout title="Team">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{members.length} team members</p>
          <Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" /> Invite Member</Button>
        </div>
        <Card>
          <CardContent className="p-0 divide-y">
            {members.map((m) => (
              <div key={m.email} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-[10px] ${roleColor[m.role]}`}>{m.role}</Badge>
                  {m.status === "Invited" && <Badge variant="secondary" className="text-[10px]">Pending</Badge>}
                  <button className="p-1 rounded hover:bg-muted transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
