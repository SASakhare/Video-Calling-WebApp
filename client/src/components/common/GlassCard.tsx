import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  className, children, hover = false, ...props
}: HTMLMotionProps<"div"> & { hover?: boolean }) {
  return (
    <motion.div
      className={cn(
        "glass-panel p-6",
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
