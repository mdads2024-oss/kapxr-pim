import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Monitor, Moon, Search, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAssetsQuery, useCategoriesQuery, useProductsQuery } from "@/hooks/usePimQueries";
import { cn } from "@/lib/utils";
import { applyThemeToDocument, getTheme, getThemeEventName, setTheme, type AppTheme } from "@/lib/theme";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [theme, setThemeState] = useState<AppTheme>(() => getTheme());
  const { data: products = [] } = useProductsQuery();
  const { data: assets = [] } = useAssetsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    const themeEventName = getThemeEventName();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "kapxr:theme") {
        setThemeState(getTheme());
      }
    };

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<AppTheme>;
      setThemeState(customEvent.detail ?? getTheme());
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (getTheme() === "system") {
        applyThemeToDocument("system");
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(themeEventName, handleThemeChange as EventListener);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(themeEventName, handleThemeChange as EventListener);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const cycleTheme = () => {
    const nextTheme: AppTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  const suggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    const productMatches = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        key: `product-${p.id}`,
        label: `${p.name} (${p.sku})`,
        type: "Product",
        action: () => navigate(`/products/${p.id}`),
      }));

    const assetMatches = assets
      .filter((a) => a.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((a) => ({
        key: `asset-${a.id}`,
        label: a.name,
        type: "Asset",
        action: () => navigate("/assets"),
      }));

    const categoryMatches = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        key: `category-${c.id}`,
        label: c.name,
        type: "Category",
        action: () => navigate("/categories"),
      }));

    return [...productMatches, ...assetMatches, ...categoryMatches].slice(0, 6);
  }, [assets, categories, navigate, products, searchTerm]);

  const runTopSuggestion = () => {
    if (!suggestions.length) return;
    suggestions[0].action();
    setSearchTerm("");
    setIsFocused(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header
            className="flex h-14 items-center justify-between border-b bg-card px-3 md:px-4"
          >
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              {title && (
                <h1 className="text-base font-semibold tracking-tight md:text-lg">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 120)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      runTopSuggestion();
                    }
                  }}
                  placeholder="Search products, assets..."
                  className="h-8 w-60 border-0 bg-secondary pl-8 text-sm lg:w-64"
                />
                {isFocused && searchTerm.trim().length > 0 && (
                  <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md">
                    {suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <button
                          key={item.key}
                          onMouseDown={() => {
                            item.action();
                            setSearchTerm("");
                            setIsFocused(false);
                          }}
                          className="w-full text-left rounded-sm px-2 py-1.5 hover:bg-accent transition-colors"
                        >
                          <div className="text-[13px]">{item.label}</div>
                          <div className="text-[10px] text-muted-foreground">{item.type}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-[13px] text-muted-foreground">No matches found</div>
                    )}
                  </div>
                )}
              </div>
              <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
              </button>
              <button
                onClick={cycleTheme}
                className="relative p-2 rounded-md hover:bg-secondary transition-colors"
                title={`Theme: ${theme}`}
                aria-label={`Current theme ${theme}. Click to change theme`}
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                ) : theme === "dark" ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  KP
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main
            className="app-content flex-1 overflow-auto p-4 text-[13px] md:p-5"
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
