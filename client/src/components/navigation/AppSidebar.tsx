import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Video, History, Bell, Settings, User, HelpCircle,
  LogOut, PanelLeftClose, PanelLeft, Plus,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meetings/new", label: "New meeting", icon: Video },
  { to: "/history", label: "History", icon: History },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

const bottom = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: HelpCircle },
];

export function AppSidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const initials = (user?.name || "U").split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-[248px]"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
        <Logo showText={!collapsed} />
      </div>

      <div className={cn("p-3", collapsed && "px-2")}>
        <Button
          onClick={() => navigate("/meetings/new")}
          className={cn("w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow", collapsed && "h-10 w-10 p-0")}
        >
          <Plus className={cn("h-4 w-4", !collapsed && "mr-1.5")} />
          {!collapsed && "New meeting"}
        </Button>
      </div>

      <nav className={cn("flex-1 space-y-1 overflow-y-auto p-3", collapsed && "px-2")}>
        {items.map((i) => (
          <NavItem key={i.to} {...i} collapsed={collapsed} />
        ))}
      </nav>

      <div className={cn("space-y-1 p-3", collapsed && "px-2")}>
        {bottom.map((i) => (
          <NavItem key={i.to} {...i} collapsed={collapsed} />
        ))}
      </div>

      <Separator className="bg-sidebar-border" />

      <div className={cn("flex items-center gap-2 p-2", collapsed && "justify-center")}>
        {/* Clickable profile area */}
        <button
          onClick={() => navigate("/profile")}
          title="View profile"
          className={cn(
            "flex items-center gap-3 min-w-0 flex-1 rounded-xl px-1.5 py-1.5",
            "transition-colors hover:bg-sidebar-accent group",
            collapsed && "justify-center px-0 flex-none"
          )}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 shrink-0 transition-transform group-hover:scale-105">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-brand text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">{user?.name || "Guest"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
            </div>
          )}
        </button>

        {/* Logout button */}
        {!collapsed && (
          <Button
            variant="ghost" size="icon" className="h-8 w-8 shrink-0"
            onClick={() => { logout(); toast.success("Signed out"); navigate("/"); }}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>

      <button
        onClick={toggle}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground"
        aria-label="Collapse sidebar"
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </aside>
  );
}

function NavItem({
  to, label, icon: Icon, collapsed,
}: { to: string; label: string; icon: typeof LayoutDashboard; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
          collapsed && "justify-center px-2"
        )
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}
