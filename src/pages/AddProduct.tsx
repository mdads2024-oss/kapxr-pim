import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Save, Plus, X, Image, Search, Check, FileText, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const digitalAssets = [
  { id: 1, name: "hero-banner-spring.jpg", type: "Image", size: "2.4 MB", dimensions: "1920×1080", tags: ["banner", "spring"] },
  { id: 2, name: "product-headphones-front.png", type: "Image", size: "1.1 MB", dimensions: "2000×2000", tags: ["product", "headphones"] },
  { id: 3, name: "brand-video-2024.mp4", type: "Video", size: "48 MB", dimensions: "3840×2160", tags: ["brand", "video"] },
  { id: 4, name: "catalog-spring-2026.pdf", type: "Document", size: "12 MB", dimensions: "–", tags: ["catalog", "pdf"] },
  { id: 5, name: "lifestyle-office-setup.jpg", type: "Image", size: "3.8 MB", dimensions: "4000×2667", tags: ["lifestyle"] },
  { id: 6, name: "product-keyboard-top.png", type: "Image", size: "980 KB", dimensions: "2000×2000", tags: ["product", "keyboard"] },
  { id: 7, name: "unboxing-tutorial.mp4", type: "Video", size: "120 MB", dimensions: "1920×1080", tags: ["tutorial"] },
  { id: 8, name: "brand-guidelines-v3.pdf", type: "Document", size: "8.2 MB", dimensions: "–", tags: ["brand", "guidelines"] },
];

const assetTypeIcon: Record<string, typeof Image> = { Image, Video: Film, Document: FileText };
const assetTypeColor: Record<string, string> = {
  Image: "bg-primary/10 text-primary",
  Video: "bg-success/10 text-success",
  Document: "bg-warning/10 text-warning",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [brand, setBrand] = useState("");
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
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<typeof digitalAssets>([]);

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

  const removeAsset = (id: number) => {
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

  const handleSave = () => {
    if (!name.trim() || !sku.trim()) {
      toast({
        title: "Missing required fields",
        description: "Product Name and SKU are required.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Product created",
      description: `"${name}" has been added successfully.`,
    });
    navigate("/products");
  };

  return (
    <AppLayout title="Add Product">
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
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU <span className="text-destructive">*</span></Label>
                    <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. WHP-001" />
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
                  />
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
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Audio">Audio</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Input Devices">Input Devices</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Kapxr Audio" />
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
    </AppLayout>
  );
}
