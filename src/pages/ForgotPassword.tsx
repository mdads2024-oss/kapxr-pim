import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notify";
import { insforgeClient } from "@/services/insforgeClient";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, ShieldCheck, Sparkles } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      notifyError(toast, "Email required", "Please enter your account email.");
      return;
    }
    try {
      setIsSending(true);
      const { error } = await insforgeClient.auth.sendResetPasswordEmail({
        email: email.trim().toLowerCase(),
      });
      if (error) {
        notifyError(toast, "Unable to send code", error.message);
        return;
      }
      setCodeSent(true);
      notifySuccess(toast, "Code sent", "Check your email for the reset code.");
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !code.trim() || !newPassword.trim()) {
      notifyError(toast, "Missing details", "Please fill all fields.");
      return;
    }
    if (newPassword.trim().length < 6) {
      notifyError(toast, "Weak password", "Use at least 6 characters.");
      return;
    }
    try {
      setIsResetting(true);
      const exchange = await insforgeClient.auth.exchangeResetPasswordToken({
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });
      if (exchange.error || !exchange.data?.token) {
        notifyError(toast, "Invalid code", exchange.error?.message || "Please use a valid reset code.");
        return;
      }
      const reset = await insforgeClient.auth.resetPassword({
        newPassword: newPassword.trim(),
        otp: exchange.data.token,
      });
      if (reset.error) {
        notifyError(toast, "Reset failed", reset.error.message);
        return;
      }
      notifySuccess(toast, "Password reset", "You can now sign in with your new password.");
      navigate("/signin");
    } catch (err) {
      notifyError(toast, "Reset failed", err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsResetting(false);
    }
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
                Reset your <span className="brand-gradient-animated">KapxrPIM</span> password
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Request a reset code and set a new secure password to continue.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSendCode}>
              <div className="space-y-2">
                <Label htmlFor="reset-email">Work Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline" className="w-full h-10" disabled={isSending}>
                {isSending ? "Sending..." : codeSent ? "Resend code" : "Send reset code"}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="h-px w-full bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                Verify & reset
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset code</Label>
                <Input
                  id="reset-code"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Secure recovery
                </span>
                <Link to="/signin" className="text-xs text-primary hover:underline">
                  Back to sign in
                </Link>
              </div>
              <Button type="submit" className="w-full h-10" disabled={isResetting}>
                {isResetting ? "Updating..." : "Update password"}
              </Button>
            </form>
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
                Account Recovery
              </div>
              <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                Get back into your workspace safely.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                Verify ownership with a reset code and continue working on products, assets, and channels.
              </p>

              <div className="mt-7 grid gap-3">
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="inline-flex items-center gap-1 text-xs text-white/80"><KeyRound className="h-3.5 w-3.5" /> Reset code delivery</p>
                  <p className="text-xl font-semibold">Instant</p>
                </motion.div>
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs text-white/80">Account security</p>
                  <p className="text-xl font-semibold">Protected flow</p>
                </motion.div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/90">
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Verified password reset journey</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Continue without losing workspace data</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

