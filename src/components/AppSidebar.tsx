import {
  LayoutDashboard,
  Package,
  Image,
  FolderTree,
  Tags,
  Settings,
  Users,
  BarChart3,
  Upload,
  Plug,
  CreditCard,
  Shield,
  LogOut,
  GitBranch,
  Activity,
  HelpCircle,
  Building2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import kapxrLogo from "@/assets/kapxr-logo.png";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const SIDEBAR_GROUP_STATE_KEY = "kapxr:sidebar:groups";

type GroupKey = "main" | "setup" | "manage" | "settings";
type GroupState = Record<GroupKey, boolean>;

const defaultGroupState: GroupState = {
  main: true,
  setup: true,
  manage: true,
  settings: true,
};

const mainItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Assets", url: "/assets", icon: Image },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
  { title: "Activity", url: "/activity", icon: Activity },
];

/** Catalog structure — aligned with demo "Setup" group */
const setupItems = [
  { title: "Brands", url: "/brands", icon: Building2 },
  { title: "Categories", url: "/categories", icon: FolderTree },
  { title: "Attributes", url: "/attributes", icon: Tags },
];

const manageItems = [
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Import / Export", url: "/import-export", icon: Upload },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Team", url: "/team", icon: Users },
];

const settingsItems = [
  { title: "Help & Support", url: "/help", icon: HelpCircle },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Sign Out", url: "/logout", icon: LogOut },
];

type AdminMe = {
  email: string | null;
  isAdmin: boolean;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [groupState, setGroupState] = useState<GroupState>(() => {
    if (typeof window === "undefined") return defaultGroupState;
    const saved = window.localStorage.getItem(SIDEBAR_GROUP_STATE_KEY);
    if (!saved) return defaultGroupState;
    try {
      return { ...defaultGroupState, ...(JSON.parse(saved) as Partial<GroupState>) };
    } catch {
      return defaultGroupState;
    }
  });
  const { data: adminMe } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => apiClient.get<AdminMe>("/admin/me"),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_GROUP_STATE_KEY, JSON.stringify(groupState));
  }, [groupState]);

  const toggleGroup = (group: GroupKey) => {
    setGroupState((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const expandedGroupState = useMemo<GroupState>(() => {
    if (!collapsed) return groupState;
    return { main: true, setup: true, manage: true, settings: true };
  }, [collapsed, groupState]);

  const isActive = (path: string) => {
    const p = location.pathname;
    if (path === "/app") return p === "/app" || p === "/dashboard";
    if (path === "/products") return p.startsWith("/products");
    if (path === "/categories") return p.startsWith("/categories");
    if (path === "/attributes") return p.startsWith("/attributes");
    if (path === "/brands") return p.startsWith("/brands");
    return p === path;
  };

  const renderGroup = (
    groupKey: GroupKey,
    label: string,
    items: Array<{ title: string; url: string; icon: typeof LayoutDashboard }>
  ) => (
    <SidebarGroup>
      {!collapsed && label ? (
        <>
          <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-[10px] tracking-widest font-semibold">
            {label}
          </SidebarGroupLabel>
          <SidebarGroupAction
            aria-label={`${expandedGroupState[groupKey] ? "Collapse" : "Expand"} ${label} menu`}
            title={`${expandedGroupState[groupKey] ? "Collapse" : "Expand"} ${label}`}
            onClick={() => toggleGroup(groupKey)}
          >
            {expandedGroupState[groupKey] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarGroupAction>
        </>
      ) : null}
      <SidebarGroupContent className={expandedGroupState[groupKey] ? "" : "hidden"}>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <NavLink
                  to={item.url}
                  end={item.url === "/app"}
                  className="transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <img src={kapxrLogo} alt="KapxrPIM" className="h-8 w-8 rounded-md object-cover" />
        {!collapsed && (
          <span className="text-sidebar-foreground font-bold text-lg tracking-tight">
            KapxrPIM
          </span>
        )}
      </div>
      <SidebarContent className="pt-2">
        {renderGroup("main", "Main", mainItems)}
        {renderGroup("setup", "Setup", setupItems)}
        {renderGroup("manage", "Manage", manageItems)}
      </SidebarContent>
      <SidebarFooter>
        {renderGroup("settings", "More", [
          ...settingsItems.slice(0, 1),
          ...(adminMe?.isAdmin ? [{ title: "Admin", url: "/admin", icon: Shield }] : []),
          ...settingsItems.slice(1),
        ])}
      </SidebarFooter>
    </Sidebar>
  );
}
