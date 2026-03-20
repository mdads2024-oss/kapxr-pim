import { Navigate } from "react-router-dom";
import { signOutSession } from "@/lib/auth";

export default function SignOut() {
  signOutSession();
  return <Navigate to="/signin" replace />;
}
