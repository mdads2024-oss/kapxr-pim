import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { notifyError, notifySuccess } from "@/lib/notify";
import { useToast } from "@/hooks/use-toast";
import { signInSession } from "@/lib/auth";
import { CheckCircle2, Sparkles, BarChart3, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      notifyError(toast, "Missing credentials", "Please enter email and password.");
      return;
    }

    signInSession({ email: email.trim() });
    notifySuccess(toast, "Welcome back", "Signed in successfully.");
    navigate("/app");
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
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back to <span className="brand-gradient-animated">KapxrPIM</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue managing products, assets, and channels.
              </p>
            </div>

            <div className="space-y-4">
              <Button type="button" variant="outline" className="w-full">
                Sign in with Google
              </Button>
              <div className="relative py-1">
                <div className="h-px w-full bg-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                  OR
                </span>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    Secure login
                  </span>
                  <button type="button" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full h-10">Sign in</Button>
                <p className="text-xs text-muted-foreground text-center">
                  New to KapxrPIM?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="order-1 relative overflow-hidden bg-gradient-to-br from-[#3b2dcb] via-[#4b3be0] to-[#5f4cf1] p-6 md:order-2 md:p-10 lg:p-12"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 22%, white 0, transparent 30%), radial-gradient(circle at 78% 72%, white 0, transparent 24%)",
              }}
            />
            <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full border border-white/20" />
            <div className="absolute -right-20 -top-10 h-48 w-48 rounded-full border border-white/20" />

            <div className="relative z-10 max-w-md">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Pro Product Operations
              </div>
              <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                Great work is waiting for you.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                Manage catalog, assets, and channels in one modern workspace built for growth teams.
              </p>

              <div className="mt-8 grid gap-3">
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs text-white/80">Catalog completeness</p>
                  <p className="text-xl font-semibold">87%</p>
                </motion.div>
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="inline-flex items-center gap-1 text-xs text-white/80"><BarChart3 className="h-3.5 w-3.5" /> Time-to-publish</p>
                  <p className="text-xl font-semibold">2.8x faster</p>
                </motion.div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/90">
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Team-ready workflow control</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Channel sync visibility</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
