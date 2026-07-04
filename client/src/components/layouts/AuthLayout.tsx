import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden hero-bg">
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-40" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-primary-glow/20 blur-[120px]" />

      <header className="absolute inset-x-0 top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-md px-4 py-24"
      >
        <div className="glass-panel p-8 shadow-xl">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected by industry-standard encryption
        </p>
      </motion.div>
    </div>
  );
}
