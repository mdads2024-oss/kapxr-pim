import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, Tags } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCategoriesQuery, useCreateAttributeMutation } from "@/hooks/usePimQueries";

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
];

export default function AddAttribute() {
  useAppPageTitle("Create New Attribute");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: categories = [] } = useCategoriesQuery();
  const createAttributeMutation = useCreateAttributeMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [group, setGroup] = useState("");
  const [required, setRequired] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const showOptions = type === "Select" || type === "Multi-select";

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setOptionInput("");
    }
  };

  const removeOption = (opt: string) => {
    setOptions(options.filter((o) => o !== opt));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!name || !type || !group) {
      toast({
        title: "Missing fields",
        description: "Please fill in the attribute name, type, and group.",
        variant: "destructive",
      });
      return;
    }
    await createAttributeMutation.mutateAsync({
      name,
      type: type as "Text" | "Rich Text" | "Number" | "Select" | "Multi-select",
      group,
      values: showOptions ? options.length : null,
      options: showOptions ? options : [],
      required,
      categories: selectedCategories,
    });
    toast({
      title: "Attribute created",
      description: `"${name}" has been added to ${group}.`,
    });
    navigate("/attributes");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/attributes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Create New Attribute</h2>
            <p className="text-sm text-muted-foreground">Define a new attribute for your product catalog</p>
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
                  <Label htmlFor="attr-name">Attribute Name *</Label>
                  <Input
                    id="attr-name"
                    placeholder="e.g. Battery Life, Material, Weight"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attr-desc">Description</Label>
                  <Textarea
                    id="attr-desc"
                    placeholder="Describe what this attribute represents..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
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
                            onClick={() => removeOption(opt)}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No options added yet. Add values that users can select from.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Category assignment */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Category Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select which product categories this attribute applies to. Leave empty to apply to all categories.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const selected = selectedCategories.includes(cat.name);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.name)}
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
                            <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {cat.name}
                      </button>
                    );
                  })}
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
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center">
                      <Tags className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="font-medium text-sm">{name || "Attribute Name"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {type && <Badge variant="secondary" className="text-[10px]">{type}</Badge>}
                    {group && <Badge variant="outline" className="text-[10px]">{group}</Badge>}
                    {required && (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                        Required
                      </Badge>
                    )}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.map((c) => (
                          <Badge key={c} variant="secondary" className="text-[10px] font-normal">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {options.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Options ({options.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {options.slice(0, 5).map((o) => (
                          <Badge key={o} variant="secondary" className="text-[10px] font-normal">{o}</Badge>
                        ))}
                        {options.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">+{options.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} className="w-full">
                Create New Attribute
              </Button>
              <Button variant="outline" onClick={() => navigate("/attributes")} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
