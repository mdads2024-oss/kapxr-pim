import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, MoreHorizontal, Copy, Eye, Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductsQuery,
  useUpdateProductMutation,
} from "@/hooks/usePimQueries";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifyError, notifySuccess } from "@/lib/notify";

const statusColor: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  "In Review": "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

export default function Products() {
  useAppPageTitle("Products");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: products = [], isLoading } = useProductsQuery();
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "In Review" | "Draft">("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [products, searchTerm, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  if (isLoading) {
    return <AppLoader message="Loading products…" />;
  }

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage]);

  const handleDelete = async (id: number) => {
    await deleteProductMutation.mutateAsync(id);
    notifySuccess(toast, "Product deleted");
  };

  const handleDuplicate = async (id: number) => {
    const source = products.find((item) => item.id === id);
    if (!source) return;
    await createProductMutation.mutateAsync({
      ...source,
      sku: `${source.sku}-COPY`,
      name: `${source.name} Copy`,
    });
    notifySuccess(toast, "Product duplicated");
  };

  const handleStatusChange = async (id: number, status: "Published" | "In Review" | "Draft") => {
    await updateProductMutation.mutateAsync({ id, data: { status } });
    notifySuccess(toast, "Product updated", `Status changed to ${status}`);
  };

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9 w-64 bg-card border"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/products/new")}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>

        {/* Table */}
        <Card className="pim-card-shell">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pim-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="pim-table-th">Product</th>
                    <th className="pim-table-th hidden md:table-cell">SKU</th>
                    <th className="pim-table-th hidden lg:table-cell">Category</th>
                    <th className="pim-table-th hidden sm:table-cell">Completeness</th>
                    <th className="pim-table-th">Status</th>
                    <th className="pim-table-th hidden lg:table-cell">Channels</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 border-border/50 hover:bg-accent/30 transition-colors cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="pim-list-icon bg-primary/10">
                            <Package className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold">{p.name}</span>
                            </p>
                            <p className="pim-list-meta md:hidden">{p.sku} · {p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{p.sku}</td>
                      <td className="p-3 text-muted-foreground hidden lg:table-cell">{p.category}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2 w-28">
                          <Progress value={p.completeness} className="h-1" />
                          <span className="text-[10px] text-muted-foreground/70 font-medium tabular-nums">{p.completeness}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] font-medium ${statusColor[p.status]}`}>{p.status}</Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">{p.channels}</td>
                      <td className="p-3" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-muted transition-colors">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-44 rounded-lg p-1 shadow-lg border-border/60"
                            sideOffset={8}
                          >
                            <DropdownMenuLabel className="px-2 py-1 text-[10px] tracking-wide uppercase text-muted-foreground/90">
                              Product Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="h-7 rounded-md text-[13px] gap-2 px-2" onClick={() => navigate(`/products/${p.id}`)}>
                              <Eye className="h-3.5 w-3.5" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-7 rounded-md text-[13px] gap-2 px-2" onClick={() => handleDuplicate(p.id)}>
                              <Copy className="h-3.5 w-3.5" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuLabel className="px-2 py-1 text-[10px] tracking-wide uppercase text-muted-foreground/90">
                              Set Status
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="h-7 rounded-md text-[13px] gap-2 px-2" onClick={() => handleStatusChange(p.id, "Published")}>
                              <Check className={`h-3.5 w-3.5 ${p.status === "Published" ? "opacity-100" : "opacity-0"}`} />
                              Published
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-7 rounded-md text-[13px] gap-2 px-2" onClick={() => handleStatusChange(p.id, "In Review")}>
                              <Check className={`h-3.5 w-3.5 ${p.status === "In Review" ? "opacity-100" : "opacity-0"}`} />
                              In Review
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-7 rounded-md text-[13px] gap-2 px-2" onClick={() => handleStatusChange(p.id, "Draft")}>
                              <Check className={`h-3.5 w-3.5 ${p.status === "Draft" ? "opacity-100" : "opacity-0"}`} />
                              Draft
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2 text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(p.id)}
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
              totalItems={filteredProducts.length}
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
        title="Delete product?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteTarget === null) return;
          try {
            await handleDelete(deleteTarget);
          } catch (error) {
            notifyError(toast, "Delete failed", "Please try again.");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
