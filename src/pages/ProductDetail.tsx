import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppLoader } from "@/components/shared/AppLoader";
import { ArrowLeft, Save, MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductQuery,
  useUpdateProductMutation,
} from "@/hooks/usePimQueries";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  "In Review": "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const productId = Number(id);
  const { data: product, isLoading } = useProductQuery(productId);
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const createProductMutation = useCreateProductMutation();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"Published" | "In Review" | "Draft">("Draft");

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setStatus(product.status);
  }, [product]);

  const completenessLabel = useMemo(() => `${product?.completeness ?? 0}%`, [product?.completeness]);

  const handleSave = async () => {
    if (!product) return;
    await updateProductMutation.mutateAsync({
      id: product.id,
      data: { name, sku, category, status },
    });
    toast({ title: "Product updated" });
  };

  const handleDelete = async () => {
    if (!product) return;
    await deleteProductMutation.mutateAsync(product.id);
    toast({ title: "Product deleted" });
    navigate("/products");
  };

  const handleDuplicate = async () => {
    if (!product) return;
    await createProductMutation.mutateAsync({
      ...product,
      name: `${product.name} Copy`,
      sku: `${product.sku}-COPY`,
    });
    toast({ title: "Product duplicated" });
  };

  if (isLoading) {
    return (
      <AppLayout title="Product">
        <AppLoader message="Loading product…" />
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="space-y-3">
          <h1 className="text-lg font-semibold">Product not found</h1>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{product.name}</h1>
                <Badge variant="outline" className={`text-[10px] ${statusColor[product.status]}`}>{product.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-9 gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap">Completeness</span>
            <Progress value={product.completeness} className="h-2 flex-1" />
            <span className="text-sm font-semibold text-primary">{completenessLabel}</span>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input value={sku} onChange={(event) => setSku(event.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={category} onChange={(event) => setCategory(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="In Review">In Review</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Channels</span>
                  <span className="font-medium">{product.channels}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completeness</span>
                  <span className="font-medium">{product.completeness}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
