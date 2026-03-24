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
import { Search, Plus, MoreHorizontal, Building2, Eye, Copy, Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from "@/hooks/usePimQueries";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";
import type { Brand } from "@/types/pim";

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
};

function formatNow() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Brands() {
  useAppPageTitle("Brands");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: brands = [], isLoading } = useBrandsQuery();
  const createBrandMutation = useCreateBrandMutation();
  const updateBrandMutation = useUpdateBrandMutation();
  const deleteBrandMutation = useDeleteBrandMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredBrands = useMemo(
    () =>
      brands.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [brands, searchTerm]
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedBrands = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, safePage]);

  const handleDelete = async (id: string) => {
    await deleteBrandMutation.mutateAsync(id);
    notifySuccess(toast, "Brand deleted");
  };

  const handleDuplicate = async (b: Brand) => {
    const { id: _id, ...rest } = b;
    await createBrandMutation.mutateAsync({
      ...rest,
      name: `${b.name} Copy`,
      products: 0,
      updatedAt: formatNow(),
      createdAt: formatNow(),
      createdBy: "You",
    });
    notifySuccess(toast, "Brand duplicated");
  };

  const handleStatusChange = async (id: string, status: "Active" | "Inactive") => {
    await updateBrandMutation.mutateAsync({
      id,
      data: { status, updatedAt: formatNow() },
    });
    notifySuccess(toast, "Brand updated", `Status is now ${status}`);
  };

  if (isLoading) {
    return <AppLoader message="Loading brands…" />;
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="pl-9 h-9 w-64 bg-card border"
            />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/brands/new")}>
            <Plus className="h-3.5 w-3.5" /> Create New Brand
          </Button>
        </div>

        <Card className="pim-card-shell">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pim-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="pim-table-th">Brand</th>
                    <th className="pim-table-th hidden sm:table-cell text-center">Products</th>
                    <th className="pim-table-th">Status</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-10 text-center text-sm text-muted-foreground">
                        No brands found. Create your first brand to get started.
                      </td>
                    </tr>
                  )}
                  {paginatedBrands.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b last:border-0 border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/brands/${b.id}`)}
                    >
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="pim-list-icon bg-primary/10">
                            <Building2 className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold">{b.name}</span>
                            </p>
                            <p className="pim-list-meta sm:hidden">{b.products} products</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell tabular-nums text-center">
                        {b.products}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] font-medium ${statusColor[b.status]}`}>
                          {b.status}
                        </Badge>
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
                            className="w-44 rounded-lg p-1 shadow-lg border-border/60"
                            sideOffset={8}
                          >
                            <DropdownMenuLabel className="px-2 py-1 text-[10px] tracking-wide uppercase text-muted-foreground/90">
                              Brand actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => navigate(`/brands/${b.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => handleDuplicate(b)}
                            >
                              <Copy className="h-3.5 w-3.5" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuLabel className="px-2 py-1 text-[10px] tracking-wide uppercase text-muted-foreground/90">
                              Set status
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => handleStatusChange(b.id, "Active")}
                            >
                              <Check className={`h-3.5 w-3.5 ${b.status === "Active" ? "opacity-100" : "opacity-0"}`} />
                              Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => handleStatusChange(b.id, "Inactive")}
                            >
                              <Check
                                className={`h-3.5 w-3.5 ${b.status === "Inactive" ? "opacity-100" : "opacity-0"}`}
                              />
                              Inactive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2 text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(b.id)}
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
            <AppPagination
              page={safePage}
              pageSize={pageSize}
              totalItems={filteredBrands.length}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmActionDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete brand?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteTarget === null) return;
          await handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </>
  );
}
