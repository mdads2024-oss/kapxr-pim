import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tags, Plus, Search, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useAttributesQuery,
  useDeleteAttributeMutation,
  useUpdateAttributeMutation,
} from "@/hooks/usePimQueries";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";
import { toParamSlug } from "@/lib/slug";

const typeColor: Record<string, string> = {
  Select: "bg-primary/10 text-primary",
  "Multi-select": "bg-success/10 text-success",
  Text: "bg-accent text-accent-foreground",
  Number: "bg-warning/10 text-warning",
  "Rich Text": "bg-destructive/10 text-destructive",
};

export default function Attributes() {
  useAppPageTitle("Attributes");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: attributes = [], isLoading } = useAttributesQuery();
  const updateAttributeMutation = useUpdateAttributeMutation();
  const deleteAttributeMutation = useDeleteAttributeMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filteredAttributes = useMemo(
    () =>
      attributes.filter(
        (a) =>
          a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [attributes, searchTerm]
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAttributes.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedAttributes = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAttributes.slice(start, start + pageSize);
  }, [filteredAttributes, safePage]);

  const handleRename = async (id: number, currentName: string) => {
    const nextName = window.prompt("Rename attribute", currentName);
    if (!nextName || nextName === currentName) return;
    await updateAttributeMutation.mutateAsync({ id, data: { name: nextName } });
    notifySuccess(toast, "Attribute renamed");
  };

  const handleToggleRequired = async (id: number, required: boolean) => {
    await updateAttributeMutation.mutateAsync({ id, data: { required: !required } });
    notifySuccess(toast, "Attribute updated", `Required is now ${!required ? "enabled" : "disabled"}`);
  };

  const handleDelete = async (id: number) => {
    await deleteAttributeMutation.mutateAsync(id);
    notifySuccess(toast, "Attribute deleted");
  };

  if (isLoading) {
    return <AppLoader message="Loading attributes…" />;
  }

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search attributes..."
              className="pl-9 h-9 w-64 bg-card border"
            />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/attributes/new")}>
            <Plus className="h-3.5 w-3.5" /> Create New Attribute
          </Button>
        </div>

        <Card className="pim-card-shell">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <table className="pim-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="pim-table-th">Attribute</th>
                  <th className="pim-table-th hidden sm:table-cell">Type</th>
                  <th className="pim-table-th hidden md:table-cell">Group</th>
                  <th className="pim-table-th hidden md:table-cell">Categories</th>
                  <th className="pim-table-th hidden lg:table-cell">Values</th>
                  <th className="pim-table-th">Required</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttributes.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/attributes/${toParamSlug(a.name)}`)}
                  >
                    <td className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="pim-list-icon bg-accent">
                          <Tags className="h-3.5 w-3.5 text-accent-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs leading-relaxed">
                            <span className="font-semibold">{a.name}</span>{" "}
                            <span className="text-muted-foreground sm:hidden">{a.type}</span>
                          </p>
                          <p className="pim-list-meta md:hidden">{a.group}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge variant="secondary" className={`text-[10px] font-medium ${typeColor[a.type]}`}>{a.type}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{a.group}</td>
                    <td className="p-3 hidden md:table-cell">
                      {a.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {a.categories.slice(0, 2).map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px] font-normal">{c}</Badge>
                          ))}
                          {a.categories.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{a.categories.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/70">All</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{a.values ?? "–"}</td>
                    <td className="p-3">
                      {a.required ? (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Required</Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/70">Optional</span>
                      )}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="p-1 rounded hover:bg-muted transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-lg p-1 shadow-lg border-border/60"
                          sideOffset={8}
                        >
                          <DropdownMenuLabel className="px-2 py-1 text-[10px] tracking-wide uppercase text-muted-foreground/90">
                            Attribute actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="h-7 rounded-md text-[13px] gap-2 px-2"
                            onClick={() => navigate(`/attributes/${toParamSlug(a.name)}`)}
                          >
                            <Eye className="h-3.5 w-3.5" /> Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="h-7 rounded-md text-[13px] gap-2 px-2"
                            onClick={() => handleRename(a.id, a.name)}
                          >
                            <Pencil className="h-3.5 w-3.5" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="h-7 rounded-md text-[13px] gap-2 px-2"
                            onClick={() => handleToggleRequired(a.id, a.required)}
                          >
                            Toggle required
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                            className="h-7 rounded-md text-[13px] gap-2 px-2 text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(a.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </CardContent>
        </Card>
        <AppPagination page={safePage} pageSize={pageSize} totalItems={filteredAttributes.length} onPageChange={setPage} />

        <ConfirmActionDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="Delete attribute?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={async () => {
            if (deleteTarget === null) return;
            await handleDelete(deleteTarget);
            setDeleteTarget(null);
          }}
        />
      </motion.div>
    </>
  );
}
