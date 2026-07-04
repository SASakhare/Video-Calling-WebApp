import { Video } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label={APP_NAME}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-brand transition-transform group-hover:scale-105">
        <Video className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        <span className="absolute inset-0 rounded-xl bg-gradient-brand opacity-0 blur-md transition-opacity group-hover:opacity-70" />
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
