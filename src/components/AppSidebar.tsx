import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  Calendar,
  Settings,
  Users,
  NotebookPen,
  LogIn,
  ClipboardList,
} from "lucide-react";

const items = [
  { title: "My Sanctuary", url: "/dashboard", icon: Home },
  { title: "Thought Garden", url: "/journal", icon: NotebookPen },
  { title: "The Calm Corner", url: "/blog", icon: BookOpen },
  { title: "My Calendar", url: "/calendar", icon: Calendar },
  { title: "The Expert Network", url: "/psychologists", icon: Users },
  { title: "My Bookings", url: "/bookings", icon: ClipboardList },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-sm"
      : "hover:bg-gradient-accent hover:shadow-sm transition-all duration-200";

  return (
    <Sidebar 
      className={`${collapsed ? "w-14" : "w-60"} bg-gradient-sidebar border-r transition-all duration-300 hover:w-60 group`} 
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"} transition-opacity duration-300`}>
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className={`${collapsed ? "opacity-0 group-hover:opacity-100 group-hover:ml-2" : "ml-2 opacity-100"} transition-all duration-300`}>
                        {item.title}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
