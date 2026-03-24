import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, FolderTree, Upload, Copy, Check, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCategoriesQuery, useUpdateCategoryMutation } from "@/hooks/usePimQueries";
import { toParamSlug } from "@/lib/slug";

export default function CategoryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const updateCategoryMutation = useUpdateCategoryMutation();

  const category = useMemo(
    () => categories.find((c) => toParamSlug(c.name) === slug),
    [categories, slug]
  );

  useAppPageTitle(isLoading ? "Category" : !category ? "Category Not Found" : category.name);

  const [name, setName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("none");
  const [isActive, setIsActive] = useState(true);
  const [showInNav, setShowInNav] = useState(true);
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!category) return;
    setName(category.name);
    setCatSlug(toParamSlug(category.name));
    setSubcategories([...category.subcategories]);
  }, [category]);

  const parentOptions = useMemo(
    () => categories.filter((c) => c.id !== category?.id).map((c) => c.name),
    [categories, category?.id]
  );

  const entityId = category?.id ?? "";

  const handleNameChange = (value: string) => {
    setName(value);
    setCatSlug(toParamSlug(value));
  };

  const addSubcategory = () => {
    const trimmed = subcategoryInput.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories([...subcategories, trimmed]);
      setSubcategoryInput("");
    }
  };

  const removeSubcategory = (sub: string) => setSubcategories(subcategories.filter((s) => s !== sub));

  const copyId = () => {
    navigator.clipboard.writeText(entityId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!category || !name.trim()) {
      toast({ title: "Missing fields", description: "Please provide a category name.", variant: "destructive" });
      return;
    }
    try {
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        data: { name: name.trim(), subcategories },
      });
      toast({ title: "Category updated", description: `"${name.trim()}" has been saved.` });
      const nextSlug = toParamSlug(name.trim());
      if (nextSlug !== slug) {
        navigate(`/categories/${nextSlug}`, { replace: true });
      } else {
        navigate("/categories");
      }
    } catch {
      toast({ title: "Save failed", description: "Could not update category.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <AppLoader message="Loading category…" />;
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">This category could not be found.</p>
        <Button variant="outline" onClick={() => navigate("/categories")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>{category.products} products</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={updateCategoryMutation.isPending}>
            {updateCategoryMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Category Name *</Label>
                    <Input id="cat-name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input id="cat-slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} className="text-muted-foreground" readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select value={parentCategory} onValueChange={setParentCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="None (top-level category)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (top-level)</SelectItem>
                      {parentOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Subcategories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a subcategory..."
                    value={subcategoryInput}
                    onChange={(e) => setSubcategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubcategory())}
                  />
                  <Button size="sm" variant="outline" onClick={addSubcategory} className="shrink-0">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
                {subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {subcategories.map((sub) => (
                      <Badge key={sub} variant="secondary" className="gap-1 pr-1">
                        {sub}
                        <button
                          type="button"
                          onClick={() => removeSubcategory(sub)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No subcategories added yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Drop an image here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB. Recommended: 800×800px</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">Category is visible to customers</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show in Navigation</Label>
                    <p className="text-xs text-muted-foreground">Display in store menus</p>
                  </div>
                  <Switch checked={showInNav} onCheckedChange={setShowInNav} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Category ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{entityId}</code>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={copyId}>
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Products</Label>
                  <p className="text-sm">{category.products} products assigned</p>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => navigate("/categories")} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
  );
}
