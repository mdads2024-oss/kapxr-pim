import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormEvent, useMemo, useState } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useToast } from "@/hooks/use-toast";
import { signInSession } from "@/lib/auth";
import { CheckCircle2, Sparkles, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { setSelectedPlan } from "@/lib/billingSelection";
import type { BillingInterval } from "@/types/billing";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const selectedPlan = useMemo(() => {
    const plan = searchParams.get("plan");
    const interval = searchParams.get("interval");
    const isPlanValid = plan === "starter" || plan === "growth" || plan === "pro";
    const isIntervalValid = interval === "monthly" || interval === "yearly";
    if (!isPlanValid || !isIntervalValid) return null;
    return { planCode: plan, interval: interval as BillingInterval };
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      notifyError(toast, "Missing details", "Please complete all fields.");
      return;
    }
    if (password.trim().length < 6) {
      notifyError(toast, "Weak password", "Use at least 6 characters.");
      return;
    }

    if (selectedPlan) {
      setSelectedPlan(selectedPlan);
    }

    signInSession({ name: name.trim(), email: email.trim() });
    notifySuccess(toast, "Account created", "Your workspace is ready.");
    navigate(selectedPlan ? "/settings" : "/app");
  };

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-md">
        <div className="grid md:grid-cols-2">
          <motion.div
            className="order-2 p-6 md:order-1 md:p-10 lg:p-12"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Start Free</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                Create your <span className="brand-gradient-animated">KapxrPIM</span> account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Launch your KapxrPIM workspace and onboard your team in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <Button type="button" variant="outline" className="w-full">
                Continue with Google
              </Button>
              <div className="relative py-1">
                <div className="h-px w-full bg-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  OR
                </span>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full h-10">Create account</Button>
                <p className="text-xs text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="order-1 relative overflow-hidden bg-gradient-to-br from-[#3d2fd0] via-[#5342e4] to-[#6252f2] p-6 md:order-2 md:p-10 lg:p-12"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 74% 18%, white 0, transparent 34%), radial-gradient(circle at 24% 82%, white 0, transparent 26%)",
              }}
            />
            <div className="absolute -left-12 top-8 h-44 w-44 rounded-full border border-white/20" />
            <div className="absolute -right-12 bottom-6 h-52 w-52 rounded-full border border-white/20" />

            <div className="relative z-10 max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Build your digital commerce engine
              </div>
              <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                Turn your product operations into a growth machine.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                From scattered spreadsheets to governed workflows, KapxrPIM helps your team scale catalog operations with confidence.
              </p>

              <div className="mt-7 grid gap-3">
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="inline-flex items-center gap-1 text-xs text-white/80"><Users className="h-3.5 w-3.5" /> Team onboarding</p>
                  <p className="text-xl font-semibold">Under 10 min</p>
                </motion.div>
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs text-white/80">Workflow confidence</p>
                  <p className="text-xl font-semibold">99.2% consistency</p>
                </motion.div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/90">
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Guided onboarding experience</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Channel-ready publishing</p>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white">
                <Rocket className="h-3.5 w-3.5" />
                Launch your first catalog in under 30 minutes
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
