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
import { ArrowLeft, Plus, X, Tags, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useAttributesQuery,
  useCategoriesQuery,
  useUpdateAttributeMutation,
} from "@/hooks/usePimQueries";
import { toParamSlug } from "@/lib/slug";

const attributeGroups = [
  "Basic Information",
  "Organization",
  "Pricing & Inventory",
  "Physical Details",
  "Technical Specs",
  "Visibility",
];
const attributeTypes = [
  { value: "Text", description: "Single line text input" },
  { value: "Rich Text", description: "Multi-line formatted text" },
  { value: "Number", description: "Numeric value" },
  { value: "Select", description: "Single choice from predefined options" },
  { value: "Multi-select", description: "Multiple choices from predefined options" },
  { value: "Boolean", description: "True or false toggle" },
];

const typeColor: Record<string, string> = {
  Select: "bg-primary/10 text-primary",
  "Multi-select": "bg-success/10 text-success",
  Text: "bg-accent text-accent-foreground",
  Number: "bg-warning/10 text-warning",
  "Rich Text": "bg-destructive/10 text-destructive",
  Boolean: "bg-muted text-muted-foreground",
};

export default function AttributeDetail() {
  const { name: paramSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: attributes = [], isLoading: attributesLoading } = useAttributesQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesQuery();
  const updateAttributeMutation = useUpdateAttributeMutation();

  const attribute = useMemo(
    () => attributes.find((a) => toParamSlug(a.name) === paramSlug),
    [attributes, paramSlug]
  );

  const allCategoryNames = useMemo(() => categories.map((c) => c.name), [categories]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [group, setGroup] = useState("");
  const [required, setRequired] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!attribute) return;
    setName(attribute.name);
    setDescription("");
    setType(attribute.type);
    setGroup(attribute.group);
    setRequired(attribute.required);
    setSelectedCategories([...attribute.categories]);
    setOptions([]);
  }, [attribute]);

  const entityId = attribute?.id ?? "";
  const showOptions = type === "Select" || type === "Multi-select";

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setOptionInput("");
    }
  };

  const removeOption = (opt: string) => setOptions(options.filter((o) => o !== opt));

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const copyId = () => {
    navigator.clipboard.writeText(entityId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!attribute || !name.trim() || !type || !group) {
      toast({
        title: "Missing fields",
        description: "Please fill in attribute name, type, and group.",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateAttributeMutation.mutateAsync({
        id: attribute.id,
        data: {
          name: name.trim(),
          type: type as (typeof attribute)["type"],
          group,
          required,
          categories: selectedCategories,
          values: options.length > 0 ? options.length : attribute.values,
        },
      });
      toast({ title: "Attribute updated", description: `"${name.trim()}" has been saved.` });
      const next = toParamSlug(name.trim());
      if (next !== paramSlug) {
        navigate(`/attributes/${next}`, { replace: true });
      } else {
        navigate("/attributes");
      }
    } catch {
      toast({ title: "Save failed", description: "Could not update attribute.", variant: "destructive" });
    }
  };

  const isLoading = attributesLoading || categoriesLoading;

  useAppPageTitle(isLoading ? "Attribute" : !attribute ? "Attribute Not Found" : attribute.name);

  if (isLoading) {
    return <AppLoader message="Loading attribute…" />;
  }

  if (!attribute) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">This attribute could not be found.</p>
        <Button variant="outline" onClick={() => navigate("/attributes")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Attributes
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/attributes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Tags className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{attribute.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`text-[10px] ${typeColor[attribute.type]}`}>
                    {attribute.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{attribute.group}</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={updateAttributeMutation.isPending}>
            {updateAttributeMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="attr-name">Attribute Name *</Label>
                  <Input id="attr-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attr-desc">Description</Label>
                  <Textarea id="attr-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Attribute Type *</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributeTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {type && (
                      <p className="text-xs text-muted-foreground">
                        {attributeTypes.find((t) => t.value === type)?.description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Group *</Label>
                    <Select value={group} onValueChange={setGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributeGroups.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showOptions && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an option value..."
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                    />
                    <Button size="sm" variant="outline" onClick={addOption} className="shrink-0">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                  {options.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <Badge key={opt} variant="secondary" className="gap-1 pr-1">
                          {opt}
                          <button
                            type="button"
                            onClick={() => removeOption(opt)}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {attribute.values != null
                        ? `${attribute.values} predefined values (edit count on save if you add options above).`
                        : "No options added yet."}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Category Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select which categories this attribute applies to. Leave empty to apply to all.
                </p>
                {allCategoryNames.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories yet. Create categories first.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allCategoryNames.map((cat) => {
                      const selected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors text-left ${
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                              selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                            }`}
                          >
                            {selected && (
                              <svg
                                className="h-3 w-3 text-primary-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Required</Label>
                    <p className="text-xs text-muted-foreground">Must be filled when creating products</p>
                  </div>
                  <Switch checked={required} onCheckedChange={setRequired} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Attribute ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">{entityId}</code>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={copyId}>
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => navigate("/attributes")} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
  );
}
