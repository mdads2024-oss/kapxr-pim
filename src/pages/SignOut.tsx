import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { signOutSession } from "@/lib/auth";
import { insforgeClient } from "@/services/insforgeClient";

export default function SignOut() {
  useEffect(() => {
    void insforgeClient.auth.signOut().catch(() => undefined);
    signOutSession();
  }, []);

  return <Navigate to="/signin" replace />;
}
