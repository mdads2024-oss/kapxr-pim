import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, MoreHorizontal, Package, Image, Link2, Clock, Upload, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const mockProducts: Record<string, {
  id: number; name: string; sku: string; category: string; status: string; completeness: number;
  shortDescription: string; longDescription: string; brand: string; price: string; weight: string;
  dimensions: string; material: string; color: string; barcode: string; tags: string[];
  channels: string[]; createdAt: string; updatedAt: string;
}> = {
  "1": {
    id: 1, name: "Wireless Headphones Pro", sku: "WHP-001", category: "Audio", status: "Published", completeness: 100,
    shortDescription: "Premium wireless headphones with active noise cancellation and 40-hour battery life.",
    longDescription: "Experience unparalleled audio quality with the Wireless Headphones Pro. Featuring advanced active noise cancellation technology, these headphones deliver crystal-clear sound in any environment. With a 40-hour battery life, premium memory foam ear cushions, and a lightweight design, they're perfect for extended listening sessions. Bluetooth 5.3 ensures a stable, low-latency connection for music, calls, and gaming.",
    brand: "Kapxr Audio", price: "299.99", weight: "250g", dimensions: "18 × 16 × 8 cm",
    material: "Aluminum, Memory Foam, ABS Plastic", color: "Matte Black", barcode: "8901234567890",
    tags: ["wireless", "noise-cancelling", "premium", "bluetooth"], channels: ["Web Store", "Amazon", "Mobile App"],
    createdAt: "Feb 12, 2026", updatedAt: "Mar 18, 2026",
  },
  "2": {
    id: 2, name: "USB-C Hub Adapter", sku: "UCH-042", category: "Accessories", status: "In Review", completeness: 85,
    shortDescription: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
    longDescription: "The USB-C Hub Adapter transforms your laptop's single USB-C port into a versatile workstation. With 7 ports including 4K HDMI output, 3× USB 3.0, SD and microSD card readers, and 100W power delivery pass-through, it's the ultimate productivity companion. Compact and lightweight, it fits easily in any laptop bag.",
    brand: "Kapxr Tech", price: "59.99", weight: "85g", dimensions: "11 × 5 × 1.2 cm",
    material: "Aluminum Alloy", color: "Space Gray", barcode: "8901234567891",
    tags: ["usb-c", "hub", "adapter", "productivity"], channels: ["Web Store", "Amazon"],
    createdAt: "Jan 20, 2026", updatedAt: "Mar 17, 2026",
  },
  "3": {
    id: 3, name: "Ergonomic Keyboard", sku: "EKB-103", category: "Input Devices", status: "Draft", completeness: 45,
    shortDescription: "Split ergonomic mechanical keyboard with hot-swappable switches.",
    longDescription: "Designed for comfort during long typing sessions, the Ergonomic Keyboard features a split layout that promotes natural hand positioning. Hot-swappable mechanical switches let you customize the feel, while programmable RGB backlighting adds style to your setup.",
    brand: "Kapxr Tech", price: "189.99", weight: "780g", dimensions: "42 × 18 × 3.5 cm",
    material: "PBT Keycaps, Aluminum Frame", color: "White", barcode: "8901234567892",
    tags: ["ergonomic", "mechanical", "split"], channels: [],
    createdAt: "Mar 1, 2026", updatedAt: "Mar 16, 2026",
  },
};

const statusColor: Record<string, string> = {
  Published: "bg-success/10 text-success border-success/20",
  "In Review": "bg-warning/10 text-warning border-warning/20",
  Draft: "bg-muted text-muted-foreground border-border",
};

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = mockProducts[id || "1"] || mockProducts["1"];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
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
              <p className="text-sm text-muted-foreground">SKU: {product.sku} · Last updated {product.updatedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
            <Button size="sm" className="h-9 gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Completeness bar */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap">Completeness</span>
            <Progress value={product.completeness} className="h-2 flex-1" />
            <span className="text-sm font-semibold text-primary">{product.completeness}%</span>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name <span className="text-destructive">*</span></Label>
                        <Input defaultValue={product.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>SKU <span className="text-destructive">*</span></Label>
                        <Input defaultValue={product.sku} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description <span className="text-destructive">*</span></Label>
                      <Textarea defaultValue={product.shortDescription} rows={2} />
                      <p className="text-xs text-muted-foreground">{product.shortDescription.length}/300 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Long Description</Label>
                      <Textarea defaultValue={product.longDescription} rows={6} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Pricing & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Price (USD)</Label>
                        <Input type="number" defaultValue={product.price} />
                      </div>
                      <div className="space-y-2">
                        <Label>Compare at Price</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Barcode / EAN</Label>
                        <Input defaultValue={product.barcode} />
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
                        <Input defaultValue={product.weight} />
                      </div>
                      <div className="space-y-2">
                        <Label>Dimensions</Label>
                        <Input defaultValue={product.dimensions} />
                      </div>
                      <div className="space-y-2">
                        <Label>Material</Label>
                        <Input defaultValue={product.material} />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input defaultValue={product.color} />
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
                      <Select defaultValue={product.status}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue={product.category}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <Input defaultValue={product.brand} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs gap-1">
                            {t}
                            <button className="ml-0.5 hover:text-destructive"><Trash2 className="h-2.5 w-2.5" /></button>
                          </Badge>
                        ))}
                      </div>
                      <Input placeholder="Add a tag..." className="mt-1" />
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
                      <Switch defaultChecked={product.status === "Published"} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Featured</Label>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Created {product.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Updated {product.updatedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Product Media</CardTitle>
                  <Button size="sm" variant="outline" className="h-8 gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Media
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors group">
                    <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-secondary flex items-center justify-center relative group">
                      <Image className="h-8 w-8 text-muted-foreground/50" />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 rounded-lg transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Product Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Connectivity", value: "Bluetooth 5.3, 3.5mm AUX" },
                  { label: "Battery Life", value: "40 hours" },
                  { label: "Noise Cancellation", value: "Active (ANC)" },
                  { label: "Driver Size", value: "40mm" },
                  { label: "Frequency Response", value: "20Hz - 20kHz" },
                  { label: "Impedance", value: "32 Ohm" },
                ].map((attr) => (
                  <div key={attr.label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <Label className="text-sm text-muted-foreground">{attr.label}</Label>
                    <Input defaultValue={attr.value} className="sm:col-span-2" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add Attribute
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Distribution Channels</CardTitle>
                  <Button size="sm" variant="outline" className="h-8 gap-1.5">
                    <Link2 className="h-3.5 w-3.5" /> Link Channel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {product.channels.length > 0 ? (
                  <div className="space-y-3">
                    {product.channels.map((ch) => (
                      <div key={ch} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                            <Package className="h-4 w-4 text-accent-foreground" />
                          </div>
                          <span className="text-sm font-medium">{ch}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">Synced</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No channels linked yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">SEO & Meta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input defaultValue={product.name} />
                  <p className="text-xs text-muted-foreground">{product.name.length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea defaultValue={product.shortDescription} rows={3} />
                  <p className="text-xs text-muted-foreground">{product.shortDescription.length}/160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input defaultValue={product.name.toLowerCase().replace(/\s+/g, "-")} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
