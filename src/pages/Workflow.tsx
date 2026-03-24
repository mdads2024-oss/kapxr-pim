import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderTree, Tags, Image, Package, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { AppLoader } from "@/components/shared/AppLoader";

type WorkflowStep = {
  id: string;
  label: string;
  icon: string;
  route: string;
  description: string;
};

const iconByName: Record<string, typeof Package> = {
  Building2,
  FolderTree,
  Tags,
  Image,
  Package,
};

export default function Workflow() {
  useAppPageTitle("Workflows");
  const navigate = useNavigate();
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["workflow-steps"],
    queryFn: () => apiClient.get<WorkflowStep[]>("/workflows/steps"),
  });
  if (isLoading) return <AppLoader message="Loading workflows…" />;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <p className="text-sm text-muted-foreground">End-to-end workflows to streamline product creation</p>

        <Card className="hover:shadow-md transition-shadow pim-card-shell">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Product Creation Workflow</CardTitle>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    End-to-end flow — from brand setup to publishing a complete product
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] gap-1">
                {steps.length} steps
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-5">
            {/* Step flow */}
            <div className="flex items-center gap-1 flex-wrap">
              {steps.length === 0 && (
                <p className="text-sm text-muted-foreground">No workflow steps configured yet.</p>
              )}
              {steps.map((step, i) => {
                const Icon = iconByName[step.icon] ?? Package;
                return (
                  <div key={step.label} className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(step.route)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card hover:bg-accent transition-colors group"
                    >
                      <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs leading-relaxed font-semibold">{step.label}</p>
                        <p className="text-[10px] text-muted-foreground/70">{step.description}</p>
                      </div>
                    </button>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 gap-1.5" onClick={() => navigate("/brands")}>
                <Play className="h-3 w-3" /> Start Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  );
}
