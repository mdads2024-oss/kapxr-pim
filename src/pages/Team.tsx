import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import {
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useTeamMembersQuery,
  useUpdateTeamMemberMutation,
} from "@/hooks/usePimQueries";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TeamMember } from "@/types/pim";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";

const roleColor: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  Editor: "bg-success/10 text-success border-success/20",
  Viewer: "bg-muted text-muted-foreground",
};

const inviteStatusColor: Record<"Active" | "Invited", string> = {
  Active: "bg-success/10 text-success border-success/20",
  Invited: "bg-warning/10 text-warning border-warning/20",
};

export default function Team() {
  useAppPageTitle("Team");
  const { toast } = useToast();
  const { data: members = [], isLoading } = useTeamMembersQuery();
  const createTeamMemberMutation = useCreateTeamMemberMutation();
  const deleteTeamMemberMutation = useDeleteTeamMemberMutation();
  const updateTeamMemberMutation = useUpdateTeamMemberMutation();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Editor" | "Viewer">("Viewer");
  const [editMemberId, setEditMemberId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"Admin" | "Editor" | "Viewer">("Viewer");
  const [editStatus, setEditStatus] = useState<"Active" | "Invited">("Active");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(members.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedMembers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return members.slice(start, start + pageSize);
  }, [members, safePage]);

  if (isLoading) {
    return <AppLoader message="Loading team…" />;
  }

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const initials = inviteName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    await createTeamMemberMutation.mutateAsync({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
      initials: initials || "TM",
    });
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Viewer");
    setInviteOpen(false);
    notifySuccess(toast, "Invitation sent", `${inviteRole} access assigned.`);
  };

  const handleRemove = async (id: number) => {
    await deleteTeamMemberMutation.mutateAsync(id);
    notifySuccess(toast, "Team member removed");
  };

  const openEditDialog = (member: TeamMember) => {
    setEditMemberId(member.id);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editMemberId || !editName.trim() || !editEmail.trim()) return;
    const initials = editName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    await updateTeamMemberMutation.mutateAsync({
      id: editMemberId,
      data: {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        status: editStatus,
        initials: initials || "TM",
      },
    });
    setEditOpen(false);
    notifySuccess(toast, "Team member updated");
  };

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{members.length} team members</p>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => setInviteOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Invite Member
          </Button>
        </div>
        <Card className="pim-card-shell">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pim-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="pim-table-th">Team Member</th>
                    <th className="pim-table-th">Role</th>
                    <th className="pim-table-th">Invite Status</th>
                    <th className="pim-table-th !text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((m) => (
                    <tr key={m.email} className="border-b last:border-0 border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">{m.initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold">{m.name}</span>
                            </p>
                            <p className="pim-list-meta">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] font-medium ${roleColor[m.role]}`}>{m.role}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] font-medium ${inviteStatusColor[m.status]}`}>
                          {m.status === "Invited" ? "Pending Invite" : "Accepted"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="h-8 w-8 rounded-md hover:bg-muted transition-colors inline-flex items-center justify-center"
                            onClick={() => openEditDialog(m)}
                            aria-label={`Edit ${m.name}`}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            className="h-8 w-8 rounded-md hover:bg-destructive/10 transition-colors inline-flex items-center justify-center"
                            onClick={() => setDeleteTarget(m.id)}
                            aria-label={`Remove ${m.name}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <AppPagination page={safePage} pageSize={pageSize} totalItems={members.length} onPageChange={setPage} />
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={inviteName}
                onChange={(event) => setInviteName(event.target.value)}
                placeholder="Full name"
              />
              <Input
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="Email address"
              />
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as typeof inviteRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteName.trim() || !inviteEmail.trim() || createTeamMemberMutation.isPending}
                >
                  Send Invite
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Full name"
              />
              <Input
                value={editEmail}
                onChange={(event) => setEditEmail(event.target.value)}
                placeholder="Email address"
              />
              <Select value={editRole} onValueChange={(value) => setEditRole(value as typeof editRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editStatus} onValueChange={(value) => setEditStatus(value as typeof editStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Invited">Invited</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleEditSave}
                  disabled={!editName.trim() || !editEmail.trim() || updateTeamMemberMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ConfirmActionDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="Remove team member?"
          description="This member will lose access to the workspace."
          confirmLabel="Remove"
          destructive
          onConfirm={async () => {
            if (deleteTarget === null) return;
            await handleRemove(deleteTarget);
            setDeleteTarget(null);
          }}
        />
      </motion.div>
    </>
  );
}
