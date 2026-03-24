import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

type AdminMe = { email: string | null; isAdmin: boolean };
type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_active: boolean;
};
type AdminConfig = {
  app_name: string;
  maintenance_mode: boolean;
  allow_new_signups: boolean;
  support_email: string;
  default_billing_interval: "monthly" | "yearly";
};
type BillingPlan = {
  id: string;
  code: "starter" | "growth" | "pro";
  name: string;
  monthly_price: number | string;
  yearly_price: number | string;
  storage_limit_gb: number;
  seats_included: number;
  connectors_included: number;
};

export default function AdminPage() {
  useAppPageTitle("Admin");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => apiClient.get<AdminMe>("/admin/me"),
  });
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiClient.get<AdminUser[]>("/admin/users"),
    enabled: Boolean(me?.isAdmin),
  });
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: () => apiClient.get<AdminConfig>("/admin/config"),
    enabled: Boolean(me?.isAdmin),
  });
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: () => apiClient.get<BillingPlan[]>("/admin/billing/plans"),
    enabled: Boolean(me?.isAdmin),
  });

  const [draftConfig, setDraftConfig] = useState<AdminConfig | null>(null);
  const [planDrafts, setPlanDrafts] = useState<Record<string, BillingPlan>>({});

  const effectiveConfig = useMemo(() => draftConfig ?? config ?? null, [draftConfig, config]);
  const effectivePlans = useMemo(
    () => plans.map((p) => planDrafts[p.id] ?? p),
    [plans, planDrafts]
  );

  const saveConfigMutation = useMutation({
    mutationFn: (payload: Partial<AdminConfig>) => apiClient.patch<AdminConfig>("/admin/config", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-config"] });
    },
  });

  const savePlanMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BillingPlan> }) =>
      apiClient.patch(`/admin/billing/plans/${id}`, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
  });

  if (meLoading || usersLoading || configLoading || plansLoading) {
    return <AppLoader message="Loading admin console…" />;
  }

  if (!me?.isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>
            Your account does not have admin permission. Current user: {me?.email ?? "unknown"}.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const updateConfigField = <K extends keyof AdminConfig>(field: K, value: AdminConfig[K]) => {
    const base = effectiveConfig ?? {
      app_name: "KapxrPIM",
      maintenance_mode: false,
      allow_new_signups: true,
      support_email: "support@kapxr.ai",
      default_billing_interval: "monthly",
    };
    setDraftConfig({ ...base, [field]: value });
  };

  const saveConfig = async () => {
    if (!effectiveConfig) return;
    try {
      await saveConfigMutation.mutateAsync(effectiveConfig);
      notifySuccess(toast, "Admin configuration saved");
      setDraftConfig(null);
    } catch (error) {
      notifyError(toast, "Failed to save config", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const savePlan = async (planId: string) => {
    const draft = planDrafts[planId];
    if (!draft) return;
    try {
      await savePlanMutation.mutateAsync({
        id: planId,
        payload: {
          monthly_price: Number(draft.monthly_price),
          yearly_price: Number(draft.yearly_price),
          storage_limit_gb: Number(draft.storage_limit_gb),
          seats_included: Number(draft.seats_included),
          connectors_included: Number(draft.connectors_included),
        },
      });
      notifySuccess(toast, `${draft.name} plan updated`);
      setPlanDrafts((prev) => {
        const next = { ...prev };
        delete next[planId];
        return next;
      });
    } catch (error) {
      notifyError(toast, "Failed to update plan", error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Users (Separate Table)</CardTitle>
          <CardDescription>Only users listed here can access admin actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.display_name ?? "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Global app and signup behavior controls.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>App Name</Label>
            <Input
              value={effectiveConfig?.app_name ?? ""}
              onChange={(e) => updateConfigField("app_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Support Email</Label>
            <Input
              value={effectiveConfig?.support_email ?? ""}
              onChange={(e) => updateConfigField("support_email", e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Maintenance Mode</span>
            <Switch
              checked={Boolean(effectiveConfig?.maintenance_mode)}
              onCheckedChange={(v) => updateConfigField("maintenance_mode", v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span>Allow New Signups</span>
            <Switch
              checked={Boolean(effectiveConfig?.allow_new_signups)}
              onCheckedChange={(v) => updateConfigField("allow_new_signups", v)}
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={saveConfig} disabled={saveConfigMutation.isPending}>
              {saveConfigMutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan Management</CardTitle>
          <CardDescription>Edit billing plan pricing and limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {effectivePlans.map((plan) => (
            <div key={plan.id} className="rounded-lg border p-3">
              <p className="mb-2 font-semibold">{plan.name} ({plan.code})</p>
              <div className="grid gap-2 md:grid-cols-5">
                <Input
                  type="number"
                  value={String(plan.monthly_price)}
                  onChange={(e) =>
                    setPlanDrafts((prev) => ({ ...prev, [plan.id]: { ...plan, monthly_price: Number(e.target.value) } }))
                  }
                />
                <Input
                  type="number"
                  value={String(plan.yearly_price)}
                  onChange={(e) =>
                    setPlanDrafts((prev) => ({ ...prev, [plan.id]: { ...plan, yearly_price: Number(e.target.value) } }))
                  }
                />
                <Input
                  type="number"
                  value={String(plan.storage_limit_gb)}
                  onChange={(e) =>
                    setPlanDrafts((prev) => ({ ...prev, [plan.id]: { ...plan, storage_limit_gb: Number(e.target.value) } }))
                  }
                />
                <Input
                  type="number"
                  value={String(plan.seats_included)}
                  onChange={(e) =>
                    setPlanDrafts((prev) => ({ ...prev, [plan.id]: { ...plan, seats_included: Number(e.target.value) } }))
                  }
                />
                <Input
                  type="number"
                  value={String(plan.connectors_included)}
                  onChange={(e) =>
                    setPlanDrafts((prev) => ({ ...prev, [plan.id]: { ...plan, connectors_included: Number(e.target.value) } }))
                  }
                />
              </div>
              <Button className="mt-3" size="sm" onClick={() => savePlan(plan.id)} disabled={!planDrafts[plan.id] || savePlanMutation.isPending}>
                Save {plan.name}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
