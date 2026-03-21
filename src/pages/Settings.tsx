import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { getCurrentTimezone, getLanguageOptions, getTimezoneOptions } from "@/lib/localeOptions";
import { useBillingPlansQuery, useBillingSubscriptionQuery } from "@/hooks/useBillingQueries";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SETTINGS_ACCORDION_STATE_KEY = "kapxr:settings:accordion-state";
const SETTINGS_DEFAULT_LANGUAGE_KEY = "kapxr:settings:default-language";

function readSetting(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

type AccordionPersistState = {
  organizationOpen: boolean;
  securityOpen: boolean;
};

const defaultAccordionState: AccordionPersistState = {
  organizationOpen: true,
  securityOpen: true,
};

function getStoredAccordionState(): AccordionPersistState {
  if (typeof window === "undefined") return defaultAccordionState;
  const raw = window.localStorage.getItem(SETTINGS_ACCORDION_STATE_KEY);
  if (!raw) return defaultAccordionState;
  try {
    const parsed = JSON.parse(raw) as Partial<AccordionPersistState>;
    return {
      organizationOpen: parsed.organizationOpen ?? true,
      securityOpen: parsed.securityOpen ?? true,
    };
  } catch {
    return defaultAccordionState;
  }
}

export default function SettingsPage() {
  useAppPageTitle("Settings");
  const navigate = useNavigate();
  const [quickTipsOpen, setQuickTipsOpen] = useState(false);
  const [accordionState, setAccordionState] = useState<AccordionPersistState>(() => getStoredAccordionState());
  const [defaultLanguage, setDefaultLanguage] = useState(() =>
    readSetting(SETTINGS_DEFAULT_LANGUAGE_KEY, "en-US")
  );
  const [timezone, setTimezone] = useState(() => getCurrentTimezone());

  const languageOptions = useMemo(() => getLanguageOptions(), []);
  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SETTINGS_DEFAULT_LANGUAGE_KEY, defaultLanguage);
  }, [defaultLanguage]);

  const { data: plans = [] } = useBillingPlansQuery();
  const { data: subscription } = useBillingSubscriptionQuery();
  const activePlan = plans.find((plan) => plan.code === (subscription?.planCode ?? "starter"));
  const currentPlanPrice = activePlan
    ? subscription?.billingInterval === "yearly"
      ? activePlan.yearlyPrice
      : activePlan.monthlyPrice
    : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SETTINGS_ACCORDION_STATE_KEY, JSON.stringify(accordionState));
  }, [accordionState]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl space-y-4"
      >
        <div className="rounded-xl border border-border/70 bg-card/70 p-3.5 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Workspace Preferences</h2>
              <p className="text-xs text-muted-foreground">
                Keep your organization profile, alerts, and security defaults in one place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => setQuickTipsOpen(true)}>
                <Info className="h-3.5 w-3.5" />
                Quick tips
              </Button>
              <Button variant="outline" size="sm">Reset</Button>
              <Button size="sm">Save all changes</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <Card className="border-border/70">
              <Accordion
                type="single"
                collapsible
                value={accordionState.organizationOpen ? "organization" : ""}
                onValueChange={(value) =>
                  setAccordionState((previous) => ({
                    ...previous,
                    organizationOpen: value === "organization",
                  }))
                }
              >
                <AccordionItem value="organization" className="border-b-0">
                  <CardHeader className="pb-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <div className="text-left">
                        <CardTitle className="text-sm">Organization</CardTitle>
                        <CardDescription className="text-xs">Manage workspace identity and defaults.</CardDescription>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs">Organization Name</Label>
                        <Input className="h-8 text-sm" defaultValue="Kapxr Technologies" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs" htmlFor="settings-default-language">
                          Default Language
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Search by language name or code (BCP 47). Powered by browser{" "}
                          <code className="rounded bg-muted px-0.5 text-[10px]">Intl</code> APIs.
                        </p>
                        <SearchableSelect
                          id="settings-default-language"
                          options={languageOptions}
                          value={defaultLanguage}
                          onValueChange={setDefaultLanguage}
                          placeholder="Select language…"
                          searchPlaceholder="Search languages…"
                          emptyText="No language found."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs" htmlFor="settings-timezone">
                          Timezone
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Always shows your current timezone. All IANA zones (
                          <code className="rounded bg-muted px-0.5 text-[10px]">Intl</code>
                          ), with UTC offset.
                        </p>
                        <SearchableSelect
                          id="settings-timezone"
                          options={timezoneOptions}
                          value={timezone}
                          onValueChange={setTimezone}
                          placeholder="Select timezone…"
                          searchPlaceholder="Search city or region…"
                          emptyText="No timezone found."
                        />
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-2.5">
                <CardTitle className="text-sm">Notifications</CardTitle>
                <CardDescription className="text-xs">Control what your team gets notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-2.5">
                  <div>
                    <p className="text-xs font-semibold">Product updates</p>
                    <p className="text-xs text-muted-foreground">Notify when product records are changed.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-2.5">
                  <div>
                    <p className="text-xs font-semibold">Import/Export alerts</p>
                    <p className="text-xs text-muted-foreground">Receive completion and failure updates.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-2.5">
                  <div>
                    <p className="text-xs font-semibold">Team activity</p>
                    <p className="text-xs text-muted-foreground">Track role changes and member actions.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border/70">
              <Accordion
                type="single"
                collapsible
                value={accordionState.securityOpen ? "security" : ""}
                onValueChange={(value) =>
                  setAccordionState((previous) => ({
                    ...previous,
                    securityOpen: value === "security",
                  }))
                }
              >
                <AccordionItem value="security" className="border-b-0">
                  <CardHeader className="pb-0">
                    <AccordionTrigger className="py-2 hover:no-underline">
                      <div className="text-left">
                        <CardTitle className="text-sm">Security</CardTitle>
                        <CardDescription className="text-xs">Baseline protections for your workspace.</CardDescription>
                      </div>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Session timeout (minutes)</Label>
                        <Input className="h-8 text-sm" defaultValue="30" />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold">Require 2FA for admins</p>
                          <p className="text-xs text-muted-foreground">Recommended for production teams.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold">IP allowlist mode</p>
                          <p className="text-xs text-muted-foreground">Restrict dashboard access to trusted networks.</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="border-border/70 bg-muted/20">
              <CardHeader className="pb-2.5">
                <CardTitle className="text-sm">Billing & Subscription</CardTitle>
                <CardDescription>Manage all payment, invoices, and upgrade actions from Billing page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border/70 bg-gradient-to-br from-background to-muted/30 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current plan</p>
                  <div className="mt-1 flex items-end gap-2">
                    <p className="text-2xl font-semibold capitalize">{activePlan?.code ?? "starter"}</p>
                    <p className="text-lg font-medium text-muted-foreground">
                      ${currentPlanPrice}
                      <span className="text-sm">/mo</span>
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Renews on {subscription ? new Date(subscription.renewalDate).toLocaleDateString() : "--"} (
                    {subscription?.status ?? "trialing"})
                  </p>
                </div>

                <Button size="sm" className="h-8" onClick={() => navigate("/billing")}>
                  Upgrade / Manage Billing
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </motion.div>

      <Dialog open={quickTipsOpen} onOpenChange={setQuickTipsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2 text-base">
              <Info className="h-4 w-4 text-primary" />
              Quick Tips
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>- Review access roles every month.</p>
            <p>- Keep import templates versioned by team.</p>
            <p>- Enable critical alerts for failed exports.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
