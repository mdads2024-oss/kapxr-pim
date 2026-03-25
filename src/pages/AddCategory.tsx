import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, FolderTree, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCategoriesQuery, useCreateCategoryMutation } from "@/hooks/usePimQueries";
import { uploadCategoryImage } from "@/services/storage/categoryImageStorage";

export default function AddCategory() {
  useAppPageTitle("Create New Category");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories = [] } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showInNav, setShowInNav] = useState(true);
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const addSubcategory = () => {
    const trimmed = subcategoryInput.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories([...subcategories, trimmed]);
      setSubcategoryInput("");
    }
  };

  const removeSubcategory = (sub: string) => {
    setSubcategories(subcategories.filter((s) => s !== sub));
  };

  const handleSave = async () => {
    if (!name) {
      toast({
        title: "Missing fields",
        description: "Please provide a category name.",
        variant: "destructive",
      });
      return;
    }

    const imageMeta = imageFile ? await uploadCategoryImage(imageFile) : null;
    await createCategoryMutation.mutateAsync({
      name,
      products: 0,
      subcategories,
      ...(imageMeta
        ? {
            imageUrl: imageMeta.imageUrl,
            imageObjectKey: imageMeta.imageObjectKey,
            imageBucketName: imageMeta.imageBucketName,
          }
        : {}),
    });
    toast({
      title: "Category created",
      description: `"${name}" has been added successfully.`,
    });
    navigate("/categories");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Create New Category</h2>
            <p className="text-sm text-muted-foreground">Organize your products into logical groups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Category Name *</Label>
                    <Input
                      id="cat-name"
                      placeholder="e.g. Headphones, Monitors"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input
                      id="cat-slug"
                      placeholder="auto-generated-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Describe this category..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select value={parentCategory} onValueChange={setParentCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="None (top-level category)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (top-level)</SelectItem>
                      {categories.map((p) => (
                        <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Subcategories */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Subcategories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Add subcategories to further organize products within this category.</p>
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

            {/* Category Image */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Category Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Category preview"
                      className="mx-auto h-28 w-28 object-cover rounded-lg border bg-card"
                    />
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  )}
                  <p className="text-sm font-medium">Upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (up to 5MB)</p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-3"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
                      if (file) setImagePreviewUrl(URL.createObjectURL(file));
                      else setImagePreviewUrl(null);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <FolderTree className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name || "Category Name"}</p>
                      {parentCategory && parentCategory !== "none" && (
                        <p className="text-xs text-muted-foreground">under {parentCategory}</p>
                      )}
                    </div>
                  </div>
                  {subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {subcategories.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] font-normal">{s}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    {isActive && <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">Active</Badge>}
                    {showInNav && <Badge variant="outline" className="text-[10px]">In Nav</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} className="w-full">
                Create New Category
              </Button>
              <Button variant="outline" onClick={() => navigate("/categories")} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
