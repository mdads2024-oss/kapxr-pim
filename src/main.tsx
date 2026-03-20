import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPimProvider } from "@/services/initPimProvider";
import { applyThemeToDocument, getTheme } from "@/lib/theme";

initPimProvider();
applyThemeToDocument(getTheme());

createRoot(document.getElementById("root")!).render(<App />);
