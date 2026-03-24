import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Upload, Globe, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCreateBrandMutation } from "@/hooks/usePimQueries";
import { notifySuccess } from "@/lib/notify";

function formatNow() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AddBrand() {
  useAppPageTitle("Create New Brand");
  const navigate = useNavigate();
  const { toast } = useToast();
  const createBrandMutation = useCreateBrandMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide a brand name.",
        variant: "destructive",
      });
      return;
    }
    const uuid =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `brand-${Date.now()}`;
    const created = await createBrandMutation.mutateAsync({
      uuid,
      name: name.trim(),
      description: description.trim() || "No description yet.",
      website: website.trim() || "https://",
      status: isActive ? "Active" : "Inactive",
      products: 0,
      logo,
      contactEmail: email.trim() || "hello@example.com",
      contactPhone: phone.trim() || "–",
      country: "India",
      createdAt: formatNow(),
      updatedAt: formatNow(),
      createdBy: "You",
    });
    notifySuccess(toast, "Brand created", `"${created.name}" has been added.`);
    navigate(`/brands/${created.id}`);
  };

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/brands")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Create New Brand</h2>
            <p className="text-sm text-muted-foreground">Define your brand identity and details</p>
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
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name *</Label>
                  <Input
                    id="brand-name"
                    placeholder="e.g. Kapxr Audio, Kapxr Tech"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-desc">Description</Label>
                  <Textarea
                    id="brand-desc"
                    placeholder="Describe this brand..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand-website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="brand-website"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="brand-email"
                        placeholder="brand@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:w-1/2">
                  <Label htmlFor="brand-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="brand-phone"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brand Logo */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Brand Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-3">
                  {logo ? (
                    <img src={logo} alt="Brand logo preview" className="mx-auto h-16 w-16 rounded-lg object-cover border" />
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  )}
                  <p className="text-sm font-medium">Drop a logo here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 2MB. Recommended: 400×400px</p>
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} />
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
                    <p className="text-xs text-muted-foreground">Brand is visible and assignable</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
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
                      <Building2 className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name || "Brand Name"}</p>
                      {website && <p className="text-xs text-muted-foreground">{website}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className={`text-[10px] ${isActive ? "bg-primary/10 text-primary border-primary/20" : ""}`}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} className="w-full" disabled={createBrandMutation.isPending}>
                Create New Brand
              </Button>
              <Button variant="outline" onClick={() => navigate("/brands")} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
