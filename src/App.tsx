import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import Assets from "./pages/Assets";
import Categories from "./pages/Categories";
import AddCategory from "./pages/AddCategory";
import Attributes from "./pages/Attributes";
import AddAttribute from "./pages/AddAttribute";
import Integrations from "./pages/Integrations";
import ImportExport from "./pages/ImportExport";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import SettingsPage from "./pages/Settings";
import BillingPage from "./pages/Billing";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Workflow from "./pages/Workflow";
import ActivityPage from "./pages/Activity";
import CategoryDetail from "./pages/CategoryDetail";
import AttributeDetail from "./pages/AttributeDetail";
import Brands from "./pages/Brands";
import AddBrand from "./pages/AddBrand";
import BrandDetail from "./pages/BrandDetail";
import Help from "./pages/Help";
import AdminPage from "./pages/Admin";
import { isAuthenticated } from "./lib/auth";
import { AuthenticatedLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

/** Support GitHub Pages project URLs (`/<repo>/`) via Vite `base` → `import.meta.env.BASE_URL` */
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
const shouldUseHashRouter =
  typeof window !== "undefined" && window.location.hostname.endsWith("insforge.site");
const RouterComponent = shouldUseHashRouter ? HashRouter : BrowserRouter;

function RequireAuth() {
  if (!isAuthenticated()) return <Navigate to="/signin" replace />;
  return <Outlet />;
}

function PublicOnly() {
  if (isAuthenticated()) return <Navigate to="/app" replace />;
  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterComponent basename={shouldUseHashRouter ? undefined : routerBasename}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />

          <Route element={<PublicOnly />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/logout" element={<SignOut />} />
            <Route element={<AuthenticatedLayout />}>
              <Route path="/app" element={<Index />} />
              <Route path="/dashboard" element={<Navigate to="/app" replace />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<AddProduct />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/workflows" element={<Workflow />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/new" element={<AddCategory />} />
              <Route path="/categories/:slug" element={<CategoryDetail />} />
              <Route path="/attributes" element={<Attributes />} />
              <Route path="/attributes/new" element={<AddAttribute />} />
              <Route path="/attributes/:name" element={<AttributeDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brands/new" element={<AddBrand />} />
              <Route path="/brands/:id" element={<BrandDetail />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/import-export" element={<ImportExport />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/team" element={<Team />} />
              <Route path="/help" element={<Help />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/billing" element={<BillingPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouterComponent>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
