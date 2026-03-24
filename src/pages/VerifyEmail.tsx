import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notify";
import { insforgeClient } from "@/services/insforgeClient";
import { signInSession } from "@/lib/auth";

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
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-md">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the verification code sent to your email.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleVerify}>
          <div className="space-y-2">
            <Label htmlFor="verify-email">Email</Label>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify email"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleResend} disabled={isResending}>
            {isResending ? "Resending..." : "Resend code"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Back to{" "}
            <Link className="text-primary hover:underline" to="/signin">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

