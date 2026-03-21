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
import { FolderTree, Plus, Search, Package, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/usePimQueries";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";
import { toParamSlug } from "@/lib/slug";

export default function Categories() {
  useAppPageTitle("Categories");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.subcategories.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedCategories = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, safePage]);

  const handleRename = async (id: number, currentName: string) => {
    const nextName = window.prompt("Rename category", currentName);
    if (!nextName || nextName === currentName) return;
    await updateCategoryMutation.mutateAsync({ id, data: { name: nextName } });
    notifySuccess(toast, "Category renamed");
  };

  const handleDelete = async (id: number) => {
    await deleteCategoryMutation.mutateAsync(id);
    notifySuccess(toast, "Category deleted");
  };

  if (isLoading) {
    return <AppLoader message="Loading categories…" />;
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
              placeholder="Search categories..."
              className="pl-9 h-9 w-64 bg-card border"
            />
          </div>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => navigate("/categories/new")}>
            <Plus className="h-3.5 w-3.5" /> Create New Category
          </Button>
        </div>

        <Card className="pim-card-shell">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="pim-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="pim-table-th">Category</th>
                    <th className="pim-table-th hidden sm:table-cell text-center">Products</th>
                    <th className="pim-table-th hidden md:table-cell">Subcategories</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b last:border-0 border-border/50 hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/categories/${toParamSlug(c.name)}`)}
                    >
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="pim-list-icon bg-accent mt-0.5">
                            <FolderTree className="h-3.5 w-3.5 text-accent-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold">{c.name}</span>
                            </p>
                            <p className="pim-list-meta sm:hidden flex items-center gap-1">
                              <Package className="h-3 w-3 shrink-0" />
                              <span>{c.products} products</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell tabular-nums text-center">
                        {c.products}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {c.subcategories.slice(0, 4).map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px] font-medium">
                              {s}
                            </Badge>
                          ))}
                          {c.subcategories.length > 4 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{c.subcategories.length - 4}
                            </span>
                          )}
                        </div>
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
                              Category actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => navigate(`/categories/${toParamSlug(c.name)}`)}
                            >
                              <Eye className="h-3.5 w-3.5" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2"
                              onClick={() => handleRename(c.id, c.name)}
                            >
                              <Pencil className="h-3.5 w-3.5" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem
                              className="h-7 rounded-md text-[13px] gap-2 px-2 text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(c.id)}
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
              totalItems={filteredCategories.length}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>

        <ConfirmActionDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="Delete category?"
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
