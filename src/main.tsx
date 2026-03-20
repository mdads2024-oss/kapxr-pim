import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPimProvider } from "@/services/initPimProvider";
import { initBillingProvider } from "@/services/initBillingProvider";
import { applyThemeToDocument, getTheme } from "@/lib/theme";

initPimProvider();
initBillingProvider();
applyThemeToDocument(getTheme());

createRoot(document.getElementById("root")!).render(<App />);
