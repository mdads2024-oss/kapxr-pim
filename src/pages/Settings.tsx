import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import { getUiDensity, setUiDensity, type UiDensity } from "@/lib/uiDensity";
import { getTheme, setTheme, type AppTheme } from "@/lib/theme";

export default function SettingsPage() {
  const [density, setDensity] = useState<UiDensity>(() => getUiDensity());
  const [theme, setThemeState] = useState<AppTheme>(() => getTheme());

  const applyDensity = (nextDensity: UiDensity) => {
    setDensity(nextDensity);
    setUiDensity(nextDensity);
  };

  const applyTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <AppLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl space-y-5"
      >
        <div className="rounded-xl border border-border/70 bg-card/70 p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Workspace Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Keep your organization profile, alerts, and security defaults in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">Save all changes</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Organization</CardTitle>
                <CardDescription>Manage workspace identity and defaults.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="Kapxr Technologies" />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Input defaultValue="English (US)" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="Asia/Kolkata (UTC+05:30)" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Control what your team gets notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">Product updates</p>
                    <p className="text-xs text-muted-foreground">Notify when product records are changed.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">Import/Export alerts</p>
                    <p className="text-xs text-muted-foreground">Receive completion and failure updates.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">Team activity</p>
                    <p className="text-xs text-muted-foreground">Track role changes and member actions.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>Baseline protections for your workspace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session timeout (minutes)</Label>
                  <Input defaultValue="30" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Require 2FA for admins</p>
                    <p className="text-xs text-muted-foreground">Recommended for production teams.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">IP allowlist mode</p>
                    <p className="text-xs text-muted-foreground">Restrict dashboard access to trusted networks.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Tips</CardTitle>
                <CardDescription>Keep your workspace clean and safe.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>- Review access roles every month.</p>
                <p>- Keep import templates versioned by team.</p>
                <p>- Enable critical alerts for failed exports.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>
                  Switch between light, dark, or follow your system preference.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyTheme("light")}
                    className="w-full"
                  >
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyTheme("dark")}
                    className="w-full"
                  >
                    Dark
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyTheme("system")}
                    className="w-full"
                  >
                    System
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current mode: <span className="font-medium capitalize">{theme}</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Display Density</CardTitle>
                <CardDescription>
                  Choose comfortable spacing or compact mode for more data on screen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={density === "standard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyDensity("standard")}
                    className="w-full"
                  >
                    Standard
                  </Button>
                  <Button
                    type="button"
                    variant={density === "compact" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyDensity("compact")}
                    className="w-full"
                  >
                    Compact
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Compact is recommended for high-volume product management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
