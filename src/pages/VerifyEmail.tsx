import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notify";
import { insforgeClient } from "@/services/insforgeClient";
import { signInSession } from "@/lib/auth";
import { motion } from "framer-motion";
import { CheckCircle2, MailCheck, ShieldCheck, Sparkles } from "lucide-react";

export default function VerifyEmail() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otp.trim()) {
      notifyError(toast, "Code required", "Please enter the verification code.");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = email.trim()
        ? { email: email.trim().toLowerCase(), otp: otp.trim() }
        : { otp: otp.trim() };
      const { data, error } = await insforgeClient.auth.verifyEmail(payload);
      if (error || !data?.user?.email) {
        notifyError(toast, "Verification failed", error?.message || "Invalid or expired code.");
        return;
      }
      signInSession({
        email: data.user.email,
        name: (data.user.profile as { name?: string } | undefined)?.name,
      });
      notifySuccess(toast, "Email verified", "Your account is now active.");
      navigate("/app");
    } catch (err) {
      notifyError(toast, "Verification failed", err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      notifyError(toast, "Email required", "Enter your email to resend verification.");
      return;
    }
    try {
      setIsResending(true);
      const { error } = await insforgeClient.auth.resendVerificationEmail({
        email: email.trim().toLowerCase(),
      });
      if (error) {
        notifyError(toast, "Unable to resend", error.message);
        return;
      }
      notifySuccess(toast, "Verification sent", "Please check your inbox for the latest code.");
    } finally {
      setIsResending(false);
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
                Verify your <span className="brand-gradient-animated">KapxrPIM</span> email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the verification code sent to your email to activate your account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleVerify}>
              <div className="space-y-2">
                <Label htmlFor="verify-email">Work Email</Label>
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verify-code">Verification code</Label>
                <Input
                  id="verify-code"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Secure verification
                </span>
                <Link to="/signin" className="text-xs text-primary hover:underline">
                  Back to sign in
                </Link>
              </div>
              <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify email"}
              </Button>
              <Button type="button" variant="outline" className="w-full h-10" onClick={handleResend} disabled={isResending}>
                {isResending ? "Resending..." : "Resend code"}
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
                Email Verification
              </div>
              <h2 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                Activate your workspace access in seconds.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                Confirm your email with OTP verification to unlock secure access to products and channels.
              </p>

              <div className="mt-7 grid gap-3">
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="inline-flex items-center gap-1 text-xs text-white/80"><MailCheck className="h-3.5 w-3.5" /> Verification code</p>
                  <p className="text-xl font-semibold">Fast delivery</p>
                </motion.div>
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-white backdrop-blur"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="text-xs text-white/80">Account status</p>
                  <p className="text-xl font-semibold">Activation ready</p>
                </motion.div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/90">
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Verified and trusted sign-in</p>
                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Secure onboarding for your team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

