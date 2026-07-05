import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { NAV_PUBLIC } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_PUBLIC.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      isActive && "bg-secondary text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isAuthed ? (
              <Button onClick={() => navigate("/dashboard")} className="rounded-full">
                Open app <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")} className="rounded-full">Sign in</Button>
                <Button onClick={() => navigate("/register")} className="rounded-full btn-glow bg-gradient-brand text-primary-foreground hover:opacity-95">
                  Get started
                </Button>
              </>
            )}
          </div>
            {/* //* this button for small devices menu */}
          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>


      {/* //* Animate Navbar for small devices */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-b border-border/60 bg-background md:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {NAV_PUBLIC.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2 border-t border-border/60 pt-3">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setOpen(false); navigate("/login"); }}>
                  Sign in
                </Button>
                <Button className="flex-1 rounded-full bg-gradient-brand text-primary-foreground" onClick={() => { setOpen(false); navigate("/register"); }}>
                  Get started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
