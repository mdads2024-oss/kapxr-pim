import { useMemo, useState } from "react";
import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Save, Plus, X, Image, Search, Check, FileText, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  useAssetsQuery,
  useAttributesQuery,
  useBrandsQuery,
  useCategoriesQuery,
  useCreateCategoryMutation,
  useCreateAttributeMutation,
  useCreateProductMutation,
  useSaveProductAttributeValuesMutation,
} from "@/hooks/usePimQueries";
import type { PimEntityId } from "@/types/pim";

const assetTypeIcon: Record<string, typeof Image> = { Image, Video: Film, Document: FileText };
const assetTypeColor: Record<string, string> = {
  Image: "bg-primary/10 text-primary",
  Video: "bg-success/10 text-success",
  Document: "bg-warning/10 text-warning",
};

const attributeGroupOrder = [
  "Basic Information",
  "Organization",
  "Pricing & Inventory",
  "Physical Details",
  "Technical Specs",
  "Visibility",
] as const;

const attributeTypeOptions: Array<"Text" | "Rich Text" | "Number" | "Select" | "Multi-select"> = [
  "Text",
  "Rich Text",
  "Number",
  "Select",
  "Multi-select",
];

export default function AddProduct() {
  useAppPageTitle("Add Product");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: digitalAssets = [] } = useAssetsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: brands = [] } = useBrandsQuery();
  const { data: attributes = [] } = useAttributesQuery();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Draft");
  const [isActive, setIsActive] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [connectivity, setConnectivity] = useState("");
  const [batteryLife, setBatteryLife] = useState("");
  const [noiseCancellation, setNoiseCancellation] = useState("");
  const [driverSize, setDriverSize] = useState("");
  const [frequencyResponse, setFrequencyResponse] = useState("");
  const [impedance, setImpedance] = useState("");
  const [waterproofRating, setWaterproofRating] = useState("");
  const [warranty, setWarranty] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [categoryCreateOpen, setCategoryCreateOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<typeof digitalAssets>([]);
  const [errors, setErrors] = useState<{ name?: string; sku?: string; shortDescription?: string; category?: string }>({});
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({});
  const [attributeErrors, setAttributeErrors] = useState<Record<string, string>>({});

  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [attributeModalGroup, setAttributeModalGroup] = useState("Basic Information");
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeType, setNewAttributeType] = useState<"Text" | "Rich Text" | "Number" | "Select" | "Multi-select">(
    "Text"
  );
  const [newAttributeRequired, setNewAttributeRequired] = useState(false);
  const [newAttributeOptionsText, setNewAttributeOptionsText] = useState("");
  const [newAttributeAppliesTo, setNewAttributeAppliesTo] = useState<"all" | "selected">("selected");
  const createCategoryMutation = useCreateCategoryMutation();
  const createProductMutation = useCreateProductMutation();
  const createAttributeMutation = useCreateAttributeMutation();
  const saveProductAttributeValuesMutation = useSaveProductAttributeValuesMutation();

  const selectedBrandName = useMemo(() => brands.find((b) => b.id === brandId)?.name ?? "", [brands, brandId]);

  const handleCreateCategory = (payload: { name: string }) => {
    createCategoryMutation.mutate(
      {
        name: payload.name,
        products: 0,
        subcategories: [],
      },
      {
        onSuccess: (created) => {
      setCategory(created.name);
      setCategoryCreateOpen(false);
      setNewCategoryName("");
      toast({
        title: "Category created",
        description: `"${created.name}" is now available and selected.`,
      });
        },
      }
    );
  };

  const handleCreateProduct = async () => {
    const created = await createProductMutation.mutateAsync({
      name,
      sku,
      category: category || "Uncategorized",
      brand: selectedBrandName,
      status: status as "Published" | "In Review" | "Draft",
      completeness: 35,
      channels: 0,
      image: null,
    });

    const isApplicable = (a: (typeof attributes)[number]) =>
      a.categories.length === 0 || (category ? a.categories.includes(category) : false);

    const resolveValueForAttribute = (a: (typeof attributes)[number]): string | null => {
      const attrName = a.name.trim().toLowerCase();
      if (attrName === "product name") return name || null;
      if (attrName === "sku") return sku || null;
      if (attrName === "short description") return shortDescription || null;
      if (attrName === "long description") return longDescription || null;
      if (attrName === "brand") return selectedBrandName || null;
      if (attrName === "category") return category || null;

      const raw = attributeValues[a.id];
      if (!raw) return null;
      return a.type === "Multi-select" ? raw : raw.trim() ? raw : null;
    };

    const valuesToSave = attributes
      .filter((a) => isApplicable(a))
      .map((a) => ({ attributeId: a.id, value: resolveValueForAttribute(a) }))
      .filter((v) => v.value !== null && v.value !== undefined)
      .map((v) => ({ attributeId: v.attributeId, value: v.value as string }));

    if (valuesToSave.length > 0) {
      await saveProductAttributeValuesMutation.mutateAsync({
        productId: created.id,
        values: valuesToSave,
      });
    }

    setName("");
    setSku("");
    setShortDescription("");
    setLongDescription("");
    setBrandId("");
    setCategory("");
    setPrice("");
    setComparePrice("");
    setBarcode("");
    setWeight("");
    setDimensions("");
    setMaterial("");
    setColor("");
    setConnectivity("");
    setBatteryLife("");
    setNoiseCancellation("");
    setDriverSize("");
    setFrequencyResponse("");
    setImpedance("");
    setWaterproofRating("");
    setWarranty("");
    setSelectedAssets([]);
    setTags([]);
    setErrors({});
    setAttributeValues({});
    setAttributeErrors({});
    toast({
      title: "Product created",
      description: `"${name}" has been added successfully.`,
    });
    navigate("/products");
  };

  const filteredAssets = digitalAssets.filter((a) =>
    a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
    a.tags.some((t) => t.toLowerCase().includes(assetSearch.toLowerCase()))
  );

  const toggleAsset = (asset: typeof digitalAssets[0]) => {
    setSelectedAssets((prev) =>
      prev.find((a) => a.id === asset.id)
        ? prev.filter((a) => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const removeAsset = (id: PimEntityId) => {
    setSelectedAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    const nextErrors: { name?: string; sku?: string; shortDescription?: string; category?: string } = {};
    if (!name.trim()) nextErrors.name = "Product name is required.";
    if (!sku.trim()) nextErrors.sku = "SKU is required.";
    if (!shortDescription.trim()) nextErrors.shortDescription = "Short description is required.";
    if (!category.trim()) nextErrors.category = "Category is required.";

    const isApplicable = (a: (typeof attributes)[number]) =>
      a.categories.length === 0 || (category ? a.categories.includes(category) : false);

    const nextAttributeErrors: Record<string, string> = {};

    attributes
      .filter((a) => a.required && isApplicable(a))
      .forEach((a) => {
        const attrName = a.name.trim().toLowerCase();
        let value: string | null = null;

        if (attrName === "product name") value = name || null;
        else if (attrName === "sku") value = sku || null;
        else if (attrName === "short description") value = shortDescription || null;
        else if (attrName === "long description") value = longDescription || null;
        else if (attrName === "brand") value = selectedBrandName || null;
        else if (attrName === "category") value = category || null;
        else if (a.type === "Multi-select") {
          const raw = attributeValues[a.id];
          if (raw) {
            try {
              const arr = JSON.parse(raw);
              value = Array.isArray(arr) && arr.length > 0 ? raw : null;
            } catch {
              value = raw.trim() ? raw : null;
            }
          }
        } else value = attributeValues[a.id] || null;

        const isMissing =
          a.type === "Multi-select"
            ? (() => {
                const raw = attributeValues[a.id];
                if (!raw) return true;
                try {
                  const arr = JSON.parse(raw);
                  return !Array.isArray(arr) || arr.length === 0;
                } catch {
                  return !(raw || "").trim();
                }
              })()
            : !value || !String(value).trim();

        if (isMissing) nextAttributeErrors[a.id] = `${a.name} is required.`;
      });

    setErrors(nextErrors);
    setAttributeErrors(nextAttributeErrors);

    if (Object.keys(nextErrors).length > 0 || Object.keys(nextAttributeErrors).length > 0) {
      toast({
        title: "Fix highlighted fields",
        description: "Please complete required inputs.",
        variant: "destructive",
      });
      return;
    }

    await handleCreateProduct();
  };

  const isAttributeApplicableToSelectedCategory = (a: (typeof attributes)[number]) =>
    !category.trim() ? true : a.categories.length === 0 || a.categories.includes(category);

  const shouldSkipAttributeFromProductForm = (a: (typeof attributes)[number]) => {
    const n = a.name.trim().toLowerCase();
    return (
      n === "product name" ||
      n === "sku" ||
      n === "short description" ||
      n === "long description" ||
      n === "brand" ||
      n === "category"
    );
  };

  const parseMultiSelectValue = (raw: string | undefined) => {
    if (!raw) return [] as string[];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  };

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/products")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">New Product</h1>
              <p className="text-sm text-muted-foreground">Fill in the details to create a new product</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button size="sm" className="h-9 gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" /> Save Product
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>SKU <span className="text-destructive">*</span></Label>
                    <Input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. WHP-001"
                      className={errors.sku ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Short Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief product summary (max 300 characters)"
                    rows={2}
                    maxLength={300}
                    className={errors.shortDescription ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription}</p>}
                  <p className="text-xs text-muted-foreground">{shortDescription.length}/300 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Long Description</Label>
                  <Textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Detailed product description..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedAssets.map((asset) => {
                    const Icon = assetTypeIcon[asset.type];
                    return (
                      <div key={asset.id} className="relative aspect-square rounded-lg border bg-muted/30 flex flex-col items-center justify-center gap-1 group">
                        <div className={`h-8 w-8 rounded-md flex items-center justify-center ${assetTypeColor[asset.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center px-1 truncate w-full">{asset.name}</p>
                        <button
                          onClick={() => removeAsset(asset.id)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setAssetPickerOpen(true)}
                    className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group"
                  >
                    <Image className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground">Browse Assets</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Asset Picker Dialog */}
            <Dialog open={assetPickerOpen} onOpenChange={setAssetPickerOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Select from Digital Assets</DialogTitle>
                </DialogHeader>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets by name or tag..."
                    className="pl-9"
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 py-2">
                  {filteredAssets.map((asset) => {
                    const Icon = assetTypeIcon[asset.type];
                    const isSelected = selectedAssets.some((a) => a.id === asset.id);
                    return (
                      <button
                        key={asset.id}
                        onClick={() => toggleAsset(asset)}
                        className={`relative rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className={`h-16 rounded-md flex items-center justify-center mb-2 ${assetTypeColor[asset.type]}`}>
                          <Icon className="h-8 w-8 opacity-60" />
                        </div>
                        <p className="text-xs font-medium truncate">{asset.name}</p>
                        <p className="text-[10px] text-muted-foreground">{asset.size} · {asset.dimensions}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {asset.tags.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[9px] px-1 py-0">{t}</Badge>
                          ))}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">{selectedAssets.length} asset{selectedAssets.length !== 1 ? "s" : ""} selected</p>
                  <Button size="sm" onClick={() => setAssetPickerOpen(false)}>Done</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Attributes by Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {attributeGroupOrder.map((groupName) => {
                  const shownAttributes = attributes
                    .filter((a) => a.group === groupName)
                    .filter((a) => isAttributeApplicableToSelectedCategory(a))
                    .filter((a) => !shouldSkipAttributeFromProductForm(a));

                  return (
                    <div key={groupName} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-sm">{groupName}</p>
                          <p className="text-xs text-muted-foreground">
                            {shownAttributes.length} attribute{shownAttributes.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAttributeModalGroup(groupName);
                            setAttributeModalOpen(true);
                            setNewAttributeName("");
                            setNewAttributeType("Text");
                            setNewAttributeRequired(false);
                            setNewAttributeOptionsText("");
                            setNewAttributeAppliesTo(category ? "selected" : "all");
                          }}
                          className="shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add Attribute
                        </Button>
                      </div>

                      {shownAttributes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No attributes for this group.</p>
                      ) : (
                        <div className="space-y-4">
                          {shownAttributes.map((a) => {
                            const error = attributeErrors[a.id];
                            const className = error ? "border-destructive focus-visible:ring-destructive" : "";

                            if (a.type === "Text") {
                              return (
                                <div key={a.id} className="space-y-2">
                                  <Label>
                                    {a.name}
                                    {a.required && <span className="text-destructive">*</span>}
                                  </Label>
                                  <Input
                                    value={attributeValues[a.id] ?? ""}
                                    onChange={(e) =>
                                      setAttributeValues((prev) => ({ ...prev, [a.id]: e.target.value }))
                                    }
                                    placeholder={`Enter ${a.name}`}
                                    className={className}
                                  />
                                  {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                              );
                            }

                            if (a.type === "Rich Text") {
                              return (
                                <div key={a.id} className="space-y-2">
                                  <Label>
                                    {a.name}
                                    {a.required && <span className="text-destructive">*</span>}
                                  </Label>
                                  <Textarea
                                    value={attributeValues[a.id] ?? ""}
                                    onChange={(e) =>
                                      setAttributeValues((prev) => ({ ...prev, [a.id]: e.target.value }))
                                    }
                                    placeholder={`Enter ${a.name}`}
                                    rows={4}
                                    className={className}
                                  />
                                  {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                              );
                            }

                            if (a.type === "Number") {
                              return (
                                <div key={a.id} className="space-y-2">
                                  <Label>
                                    {a.name}
                                    {a.required && <span className="text-destructive">*</span>}
                                  </Label>
                                  <Input
                                    type="number"
                                    value={attributeValues[a.id] ?? ""}
                                    onChange={(e) =>
                                      setAttributeValues((prev) => ({ ...prev, [a.id]: e.target.value }))
                                    }
                                    placeholder={`Enter ${a.name}`}
                                    className={className}
                                  />
                                  {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                              );
                            }

                            if (a.type === "Select") {
                              return (
                                <div key={a.id} className="space-y-2">
                                  <Label>
                                    {a.name}
                                    {a.required && <span className="text-destructive">*</span>}
                                  </Label>
                                  <Select
                                    value={attributeValues[a.id] ?? ""}
                                    onValueChange={(value) =>
                                      setAttributeValues((prev) => ({ ...prev, [a.id]: value }))
                                    }
                                  >
                                    <SelectTrigger className={className}>
                                      <SelectValue placeholder={`Select ${a.name}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(a.options ?? []).map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                          {opt}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                              );
                            }

                            if (a.type === "Multi-select") {
                              const selected = parseMultiSelectValue(attributeValues[a.id]);
                              return (
                                <div key={a.id} className="space-y-2">
                                  <Label>
                                    {a.name}
                                    {a.required && <span className="text-destructive">*</span>}
                                  </Label>
                                  <div className={`flex flex-wrap gap-2 rounded-md p-2 border ${error ? "border-destructive" : "border-border"}`}>
                                    {(a.options ?? []).length === 0 ? (
                                      <p className="text-xs text-muted-foreground">No options configured.</p>
                                    ) : (
                                      (a.options ?? []).map((opt) => {
                                        const isSelected = selected.includes(opt);
                                        return (
                                          <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                              const next = isSelected
                                                ? selected.filter((x) => x !== opt)
                                                : [...selected, opt];
                                              setAttributeValues((prev) => ({ ...prev, [a.id]: JSON.stringify(next) }));
                                            }}
                                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                                              isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border bg-card hover:bg-muted"
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })
                                    )}
                                  </div>
                                  {error && <p className="text-xs text-destructive">{error}</p>}
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Compare at Price</Label>
                    <Input type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Barcode / EAN</Label>
                    <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="e.g. 8901234567890" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Physical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 250g" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <Input value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="L × W × H" />
                  </div>
                  <div className="space-y-2">
                    <Label>Material</Label>
                    <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Aluminum" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Matte Black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Technical Specs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Connectivity</Label>
                    <Input value={connectivity} onChange={(e) => setConnectivity(e.target.value)} placeholder="e.g. Bluetooth 5.3, 3.5mm AUX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Battery Life</Label>
                    <Input value={batteryLife} onChange={(e) => setBatteryLife(e.target.value)} placeholder="e.g. 40 hours" />
                  </div>
                  <div className="space-y-2">
                    <Label>Noise Cancellation</Label>
                    <Select value={noiseCancellation} onValueChange={setNoiseCancellation}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active (ANC)">Active (ANC)</SelectItem>
                        <SelectItem value="Passive">Passive</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver Size</Label>
                    <Input value={driverSize} onChange={(e) => setDriverSize(e.target.value)} placeholder="e.g. 40mm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency Response</Label>
                    <Input value={frequencyResponse} onChange={(e) => setFrequencyResponse(e.target.value)} placeholder="e.g. 20Hz - 20kHz" />
                  </div>
                  <div className="space-y-2">
                    <Label>Impedance</Label>
                    <Input value={impedance} onChange={(e) => setImpedance(e.target.value)} placeholder="e.g. 32 Ohm" />
                  </div>
                  <div className="space-y-2">
                    <Label>Waterproof Rating</Label>
                    <Select value={waterproofRating} onValueChange={setWaterproofRating}>
                      <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPX4">IPX4</SelectItem>
                        <SelectItem value="IPX5">IPX5</SelectItem>
                        <SelectItem value="IPX7">IPX7</SelectItem>
                        <SelectItem value="IP67">IP67</SelectItem>
                        <SelectItem value="IP68">IP68</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Warranty</Label>
                    <Select value={warranty} onValueChange={setWarranty}>
                      <SelectTrigger><SelectValue placeholder="Select warranty" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="1 year">1 year</SelectItem>
                        <SelectItem value="2 years">2 years</SelectItem>
                        <SelectItem value="3 years">3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => {
                        if (value === "__create__") {
                          setCategoryCreateOpen(true);
                          return;
                        }
                        setCategory(value);
                      }}
                    >
                    <SelectTrigger className={errors.category ? "border-destructive focus-visible:ring-destructive" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem
                          value="__create__"
                          className="font-semibold text-primary focus:text-primary"
                        >
                          + Create new category
                        </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs gap-1">
                        {t}
                        <button onClick={() => removeTag(t)} className="ml-0.5 hover:text-destructive">
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Type and press Enter..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Category Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!category.trim() ? (
                  <p className="text-sm text-muted-foreground">Select a category to see its attributes.</p>
                ) : (() => {
                  const attrsForCategory = attributes.filter((a) => a.categories.includes(category));
                  if (attrsForCategory.length === 0) {
                    return <p className="text-sm text-muted-foreground">No attributes configured for this category.</p>;
                  }

                  const byGroup: Record<string, (typeof attrsForCategory)[number][]> = {};
                  attrsForCategory.forEach((a) => {
                    byGroup[a.group] = byGroup[a.group] || [];
                    byGroup[a.group].push(a);
                  });

                  return (
                    <div className="space-y-4">
                      {Object.entries(byGroup).map(([group, groupAttrs]) => (
                        <div key={group} className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">{group}</p>
                          <div className="flex flex-wrap gap-2">
                            {groupAttrs.map((a) => (
                              <Badge key={a.id} variant="secondary" className="text-xs">
                                {a.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Active</Label>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Featured</Label>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <Dialog open={attributeModalOpen} onOpenChange={setAttributeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Attribute</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Attribute name *</Label>
              <Input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                placeholder="e.g. Battery Life"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={newAttributeType}
                  onValueChange={(v) => setNewAttributeType(v as (typeof attributeTypeOptions)[number])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {attributeTypeOptions.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Group</Label>
                <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  {attributeModalGroup}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Required</Label>
                <p className="text-xs text-muted-foreground">Must be filled when creating a product</p>
              </div>
              <Switch checked={newAttributeRequired} onCheckedChange={setNewAttributeRequired} />
            </div>

            {(newAttributeType === "Select" || newAttributeType === "Multi-select") && (
              <div className="space-y-2">
                <Label>Options (comma-separated) *</Label>
                <Input
                  value={newAttributeOptionsText}
                  onChange={(e) => setNewAttributeOptionsText(e.target.value)}
                  placeholder="e.g. Low, Medium, High"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Applies to category</Label>
              <Select
                value={newAttributeAppliesTo}
                onValueChange={(v) => setNewAttributeAppliesTo(v as "all" | "selected")}
                disabled={!category.trim()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="selected" disabled={!category.trim()}>
                    Selected category ({category || "—"})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAttributeModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const trimmedName = newAttributeName.trim();
                  if (!trimmedName) return;

                  const optionList =
                    newAttributeType === "Select" || newAttributeType === "Multi-select"
                      ? newAttributeOptionsText
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [];

                  const categoriesPayload =
                    newAttributeAppliesTo === "selected" && category.trim() ? [category] : [];

                  await createAttributeMutation.mutateAsync({
                    name: trimmedName,
                    type: newAttributeType,
                    group: attributeModalGroup,
                    required: newAttributeRequired,
                    categories: categoriesPayload,
                    values: optionList.length > 0 ? optionList.length : null,
                    options: optionList,
                  });

                  setAttributeModalOpen(false);
                  setNewAttributeName("");
                  setNewAttributeOptionsText("");
                }}
                disabled={!newAttributeName.trim() || createAttributeMutation.isPending}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryCreateOpen} onOpenChange={setCategoryCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCategoryCreateOpen(false)}>Cancel</Button>
              <Button
                onClick={() => handleCreateCategory({ name: newCategoryName.trim() })}
                disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
