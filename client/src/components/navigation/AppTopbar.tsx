import { useNavigate } from "react-router-dom";
import { Search, Bell, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useNotificationStore } from "@/store/notification.store";

export function AppTopbar() {
  const navigate = useNavigate();
  const unread = useNotificationStore((s) => s.items.filter((n) => !n.read).length);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <button
          className="group flex w-full max-w-md items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          onClick={() => navigate("/history")}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search meetings, people, recordings…</span>
          <span className="sm:hidden">Search</span>
          <span className="ml-auto hidden items-center gap-1 rounded-md border border-border/70 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost" size="icon" className="relative rounded-full"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
