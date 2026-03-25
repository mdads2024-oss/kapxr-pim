import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Image,
  FileText,
  Film,
  Upload,
  Search,
  Plus,
  Grid3X3,
  List,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useAssetsQuery,
  useCreateAssetMutation,
  useDeleteAssetMutation,
  useUpdateAssetMutation,
} from "@/hooks/usePimQueries";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/shared/AppPagination";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";
import { uploadAssetFile } from "@/services/storage/assetUpload";

const typeIcon: Record<string, typeof Image> = {
  Image: Image,
  Video: Film,
  Document: FileText,
};

const typeColor: Record<string, string> = {
  Image: "bg-primary/10 text-primary",
  Video: "bg-success/10 text-success",
  Document: "bg-warning/10 text-warning",
};

export default function Assets() {
  useAppPageTitle("Digital Assets");
  const { toast } = useToast();
  const { data: assets = [], isLoading } = useAssetsQuery();
  const createAssetMutation = useCreateAssetMutation();
  const updateAssetMutation = useUpdateAssetMutation();
  const deleteAssetMutation = useDeleteAssetMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Image" | "Video">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<"Image" | "Video">("Image");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.tags.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" ? true : asset.type === typeFilter;
        return matchesSearch && matchesType;
      }),
    [assets, searchTerm, typeFilter]
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, viewMode]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedAssets = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, safePage]);

  const handleCreateAsset = async () => {
    if (!assetFile || !assetName.trim()) return;

    const inferredType: "Image" | "Video" =
      assetFile.type.startsWith("image/") ? "Image" : assetFile.type.startsWith("video/") ? "Video" : "Image";
    setAssetType(inferredType);

    const sizeMb = (assetFile.size / (1024 * 1024)).toFixed(1);
    let dimensions = "–";
    if (inferredType === "Image") {
      const url = URL.createObjectURL(assetFile);
      try {
        dimensions = await new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(`${img.naturalWidth}×${img.naturalHeight}`);
          img.onerror = () => resolve("–");
          img.src = url;
        });
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    const uploaded = await uploadAssetFile(assetFile);
    await createAssetMutation.mutateAsync({
      name: assetName.trim(),
      type: inferredType,
      size: `${sizeMb} MB`,
      dimensions,
      tags: ["new"],
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      bucketName: uploaded.bucketName,
      objectKey: uploaded.objectKey,
      url: uploaded.url,
    });

    setAssetName("");
    setAssetFile(null);
    setAssetType("Image");
    setUploadOpen(false);
    notifySuccess(toast, "Asset added");
  };

  const handleRename = async (id: number, currentName: string) => {
    const nextName = window.prompt("Rename asset", currentName);
    if (!nextName || nextName === currentName) return;
    await updateAssetMutation.mutateAsync({ id, data: { name: nextName } });
    notifySuccess(toast, "Asset renamed");
  };

  const handleDelete = async (id: number) => {
    await deleteAssetMutation.mutateAsync(id);
    notifySuccess(toast, "Asset deleted");
  };

  if (isLoading) {
    return <AppLoader message="Loading assets…" />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search assets..."
                className="pl-9 h-9 w-64 bg-card border"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Type filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className={`h-4 w-4 ${viewMode === "grid" ? "" : "text-muted-foreground"}`} />
              </button>
              <button
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setViewMode("list")}
              >
                <List className={`h-4 w-4 ${viewMode === "list" ? "" : "text-muted-foreground"}`} />
              </button>
            </div>
            <Button size="sm" className="h-9 gap-1.5" onClick={() => setUploadOpen(true)}>
              <Upload className="h-3.5 w-3.5" /> Upload
            </Button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
          {/* Upload card */}
          <Card className="border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors cursor-pointer group pim-card-shell" onClick={() => setUploadOpen(true)}>
            <CardContent className="p-0 h-48 flex flex-col items-center justify-center gap-2">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">Drop files or click to upload</p>
            </CardContent>
          </Card>

          {paginatedAssets.length === 0 && (
            <Card className={viewMode === "grid" ? "sm:col-span-2 lg:col-span-2 xl:col-span-3" : ""}>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No assets found. Upload your first asset to continue.
              </CardContent>
            </Card>
          )}

          {paginatedAssets.map((a) => {
            const Icon = typeIcon[a.type];
            return (
              <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow group pim-card-shell">
                <div className={`${viewMode === "grid" ? "h-32" : "h-20"} flex items-center justify-center ${typeColor[a.type]}`}>
                  <Icon className="h-10 w-10 opacity-60" />
                </div>
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-relaxed font-semibold truncate">{a.name}</p>
                      <p className="pim-list-meta">
                        {a.type} · {a.size} · {a.dimensions}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRename(a.id, a.name)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(a.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-1 flex-wrap pt-0.5">
                    {a.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] font-medium px-1.5 py-0">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <AppPagination page={safePage} pageSize={pageSize} totalItems={filteredAssets.length} onPageChange={setPage} />

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={assetName}
                onChange={(event) => setAssetName(event.target.value)}
                placeholder="Asset filename"
              />
              <div className="space-y-2">
                <Label className="text-sm">Upload file</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setAssetFile(file);
                    if (file) {
                      setAssetName((prev) => prev || file.name);
                      if (file.type.startsWith("image/")) setAssetType("Image");
                      if (file.type.startsWith("video/")) setAssetType("Video");
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Uploading as <span className="font-medium">{assetType}</span>
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleCreateAsset}
                  disabled={!assetFile || !assetName.trim() || createAssetMutation.isPending}
                >
                  Add
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
          title="Delete asset?"
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
  );
}
