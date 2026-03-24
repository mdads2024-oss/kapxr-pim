import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Building2, Upload, Package, Hash, Clock, User, Copy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBrandQuery, useUpdateBrandMutation } from "@/hooks/usePimQueries";
import { ChangeEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { notifySuccess } from "@/lib/notify";
import type { Brand } from "@/types/pim";
import { uploadBrandLogo } from "@/services/storage/brandLogoStorage";

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
};

function formatNow() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BrandDetail() {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam || "";
  const { toast } = useToast();
  const { data: brand, isLoading, isError } = useBrandQuery(id);
  const updateBrandMutation = useUpdateBrandMutation();

  const [form, setForm] = useState<Partial<Brand>>({});

  useEffect(() => {
    if (brand) {
      setForm(brand);
    }
  }, [brand]);

  useAppPageTitle(brand?.name ?? form.name ?? "Brand");

  const handleSave = async () => {
    if (!brand || !form.name?.trim()) {
      toast({ title: "Missing name", description: "Brand name is required.", variant: "destructive" });
      return;
    }
    await updateBrandMutation.mutateAsync({
      id: brand.id,
      data: {
        name: form.name.trim(),
        description: form.description ?? "",
        website: form.website ?? "",
        contactEmail: form.contactEmail ?? "",
        contactPhone: form.contactPhone ?? "",
        country: form.country ?? "",
        logo: form.logo ?? null,
        logoUrl: form.logoUrl ?? form.logo ?? null,
        logoObjectKey: form.logoObjectKey ?? null,
        logoBucketName: form.logoBucketName ?? null,
        status: form.status ?? "Active",
        updatedAt: formatNow(),
      },
    });
    notifySuccess(toast, "Brand saved");
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, logo: typeof reader.result === "string" ? reader.result : null }));
    };
    reader.readAsDataURL(file);
    uploadBrandLogo(file)
      .then((meta) => {
        setForm((f) => ({
          ...f,
          logo: meta.logoUrl,
          logoUrl: meta.logoUrl,
          logoObjectKey: meta.logoObjectKey,
          logoBucketName: meta.logoBucketName,
        }));
        notifySuccess(toast, "Logo uploaded", "Saved to storage and ready to persist.");
      })
      .catch((error) => {
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Could not upload logo",
          variant: "destructive",
        });
      });
  };

  if (!id) {
    return (
      <div className="text-sm text-muted-foreground">
        Invalid brand.{" "}
        <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/brands")}>
          Back to brands
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <AppLoader message="Loading brand…" />;
  }

  if (isError || !brand) {
    return (
      <div className="text-sm text-muted-foreground">
        Brand not found.{" "}
        <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/brands")}>
          Back to brands
        </Button>
      </div>
    );
  }

  const b = { ...brand, ...form };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/brands")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{b.name}</h1>
              <Badge variant="outline" className={`text-[10px] ${statusColor[b.status]}`}>
                {b.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {b.products} products · Last updated {b.updatedAt}
            </p>
          </div>
        </div>
        <Button size="sm" className="h-9 gap-1.5" onClick={handleSave} disabled={updateBrandMutation.isPending}>
          <Save className="h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Brand Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={b.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={b.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={b.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={b.contactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={b.contactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={b.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Brand Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {b.logo ? (
                    <img src={b.logo} alt={`${b.name} logo`} className="h-24 w-24 rounded-lg object-cover" />
                  ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground/50" />
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-1.5" type="button" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-3.5 w-3.5" /> Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, logo: null }))}
                    disabled={!b.logo}
                  >
                    Remove Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">Recommended: 400×400px, PNG or SVG</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Status</Label>
                <Select
                  value={b.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as Brand["status"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Visible in Storefront</Label>
                <Switch
                  checked={b.status === "Active"}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, status: checked ? "Active" : "Inactive" }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-semibold">{b.products}</span> products assigned
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Brand UUID</span>
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">{b.uuid}</code>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => navigator.clipboard.writeText(b.uuid)}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>
                  Created by <span className="text-foreground font-medium">{b.createdBy}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Created {b.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Last updated {b.updatedAt}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
