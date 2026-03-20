import { AppLayout } from "@/components/AppLayout";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useIntegrationsQuery, useUpdateIntegrationMutation } from "@/hooks/usePimQueries";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppAlertDialog } from "@/components/shared/AppAlertDialog";
import { ConfirmActionDialog } from "@/components/shared/ConfirmActionDialog";
import { notifySuccess } from "@/lib/notify";

export default function Integrations() {
  const { toast } = useToast();
  const { data: integrations = [], isLoading } = useIntegrationsQuery();
  const updateIntegrationMutation = useUpdateIntegrationMutation();
  const [configureOpen, setConfigureOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeysByIntegration, setApiKeysByIntegration] = useState<Record<number, string>>({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("kapxr:integration-api-keys");
    if (!saved) return;
    try {
      setApiKeysByIntegration(JSON.parse(saved) as Record<number, string>);
    } catch {
      setApiKeysByIntegration({});
    }
  }, []);

  const persistApiKeys = (next: Record<number, string>) => {
    setApiKeysByIntegration(next);
    window.localStorage.setItem("kapxr:integration-api-keys", JSON.stringify(next));
  };

  if (isLoading) {
    return (
      <AppLayout title="Integrations">
        <AppLoader message="Loading integrations…" />
      </AppLayout>
    );
  }

  const handleToggle = async (id: number, connected: boolean) => {
    if (connected && !apiKeysByIntegration[id]?.trim()) {
      setAlertOpen(true);
      return;
    }

    if (!connected) {
      const integration = integrations.find((item) => item.id === id);
      setDisconnectTarget({ id, name: integration?.name ?? "this integration" });
      return;
    }

    await updateIntegrationMutation.mutateAsync({
      id,
      data: { connected, status: connected ? "Connected" : "Not Connected" },
    });
    notifySuccess(toast, connected ? "Integration connected" : "Integration disconnected");
  };

  return (
    <AppLayout title="Integrations">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Connect third-party platforms to sync product data automatically</p>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => toast({ title: "Use Configure on a card to connect details" })}>
            <Plus className="h-3.5 w-3.5" /> Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center p-2">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="h-6 w-6 dark:invert"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <span className="text-[11px] text-muted-foreground">{item.category}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.connected
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-xs">{item.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <Switch checked={item.connected} onCheckedChange={(checked) => handleToggle(item.id, checked)} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setSelectedId(item.id);
                      setSelectedName(item.name);
                      setApiKey(apiKeysByIntegration[item.id] ?? "");
                      setConfigureOpen(true);
                    }}
                  >
                    {item.connected ? "Configure" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={configureOpen} onOpenChange={setConfigureOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedName} Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="API key / token"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfigureOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    if (selectedId === null) return;
                    const next = { ...apiKeysByIntegration, [selectedId]: apiKey.trim() };
                    persistApiKeys(next);
                    setConfigureOpen(false);
                    notifySuccess(toast, "Configuration saved");
                  }}
                  disabled={!apiKey.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <AppAlertDialog
          open={alertOpen}
          onOpenChange={setAlertOpen}
          title="API key required"
          description="Please configure and save the API key first, then enable the connection toggle."
          buttonLabel="Got it"
        />
        <ConfirmActionDialog
          open={disconnectTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDisconnectTarget(null);
          }}
          title={`Disconnect ${disconnectTarget?.name ?? "integration"}?`}
          description="Product sync will stop until you reconnect."
          confirmLabel="Disconnect"
          destructive
          onConfirm={async () => {
            if (!disconnectTarget) return;
            await updateIntegrationMutation.mutateAsync({
              id: disconnectTarget.id,
              data: { connected: false, status: "Not Connected" },
            });
            notifySuccess(toast, "Integration disconnected");
            setDisconnectTarget(null);
          }}
        />
      </motion.div>
    </AppLayout>
  );
}
