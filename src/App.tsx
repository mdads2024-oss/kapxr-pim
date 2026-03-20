import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import { isAuthenticated } from "./lib/auth";


const queryClient = new QueryClient();

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<PublicOnly />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/app" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/new" element={<AddCategory />} />
            <Route path="/attributes" element={<Attributes />} />
            <Route path="/attributes/new" element={<AddAttribute />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/import-export" element={<ImportExport />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/logout" element={<SignOut />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
