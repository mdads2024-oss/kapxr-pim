import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notify";
import { insforgeClient } from "@/services/insforgeClient";

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
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-md">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Request a reset code and set a new password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSendCode}>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" className="w-full" disabled={isSending}>
            {isSending ? "Sending..." : codeSent ? "Resend code" : "Send reset code"}
          </Button>
        </form>

        <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
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
          <Button type="submit" className="w-full" disabled={isResetting}>
            {isResetting ? "Updating..." : "Update password"}
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

