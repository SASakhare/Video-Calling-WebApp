import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Video, History, Bell, Settings, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/meetings/new", label: "New", icon: Plus, primary: true },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function MobileTabBar() {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map((i) => (
          <NavLink
            key={i.to} to={i.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium",
                i.primary
                  ? "bg-gradient-brand text-primary-foreground shadow-brand"
                  : isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <i.icon className={cn("h-5 w-5", i.primary && "h-5 w-5")} />
            <span>{i.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
