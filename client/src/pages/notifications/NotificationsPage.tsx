import { useEffect, SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Check, Trash2, Calendar, Info, Flame,
  Settings, CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { notificationService } from "@/services/notification.service";
import { useNotificationStore } from "@/store/notification.store";
import { toast } from "sonner";

/** Inline clock icon — Lucide doesn't export one compatible here */
function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

type NotifType = "invite" | "reminder" | "system" | "meeting";

const icons: Record<NotifType, React.ElementType> = {
  invite: Calendar,
  reminder: ClockIcon,
  system: Info,
  meeting: Flame,
};

const itemColors: Record<NotifType, string> = {
  invite: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  reminder: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  system: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  meeting: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { items, markRead, markAllRead, seed, remove } = useNotificationStore();

  const fetchQuery = useQuery({
    queryKey: ["notifications", "seed"],
    queryFn: notificationService.list,
    enabled: items.length === 0,
  });

  useEffect(() => {
    if (fetchQuery.data && items.length === 0) {
      seed(fetchQuery.data);
    }
  }, [fetchQuery.data, items.length, seed]);

  const handleAction = (href?: string, id?: string) => {
    if (id) markRead(id);
    if (href) navigate(href);
  };

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success("All notifications marked as read");
  };

  const hasUnread = items.some((item) => !item.read);
  const isLoading = fetchQuery.isLoading && items.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Manage your meeting invitations, system updates, and reminders.
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={!hasUnread}
              className="rounded-full"
            >
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/settings")}
              className="rounded-full"
            >
              <Settings className="mr-1.5 h-4 w-4" /> Preferences
            </Button>
          </div>
        )}
      </div>

      {/* Notifications feed */}
      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
        ) : items.length > 0 ? (
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const Icon = icons[item.type as NotifType] ?? Info;
              const colorClass = itemColors[item.type as NotifType] ?? "";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard
                    className={`flex justify-between gap-4 items-center transition-all ${
                      item.read
                        ? "opacity-60 border-border/40"
                        : "border-primary/20 bg-primary/[0.02]"
                    }`}
                  >
                    {/* //* Left: icon + text */}
                    <div
                      onClick={() => handleAction(item.href, item.id)}
                      className={`flex gap-3 min-w-0 flex-1 ${item.href ? "cursor-pointer" : ""}`}
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-semibold truncate ${
                              item.read ? "text-foreground/70" : "text-foreground"
                            }`}
                          >
                            {item.title}
                          </p>
                          {!item.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1">
                          {new Date(item.createdAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* //* Right: actions */}
                    <div className="flex gap-1 shrink-0">
                      {!item.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            markRead(item.id);
                            toast.success("Marked as read");
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          remove(item.id);
                          toast.success("Notification deleted");
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <EmptyState
            icon={<Bell className="h-8 w-8" />}
            title="All caught up!"
            description="You have no notifications right now."
          />
        )}
      </div>
    </div>
  );
}
