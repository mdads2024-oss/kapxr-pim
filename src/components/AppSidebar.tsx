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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import kapxrLogo from "@/assets/kapxr-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Products", url: "/products", icon: Package },
  { title: "Digital Assets", url: "/assets", icon: Image },
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
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (
    label: string,
    items: typeof mainItems
  ) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60 uppercase text-[10px] tracking-widest font-semibold">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
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
                  end={item.url === "/"}
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
        {renderGroup("Main", mainItems)}
        {renderGroup("Manage", manageItems)}
      </SidebarContent>
      <SidebarFooter>
        {renderGroup("", settingsItems)}
      </SidebarFooter>
    </Sidebar>
  );
}
