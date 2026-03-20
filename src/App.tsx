import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
