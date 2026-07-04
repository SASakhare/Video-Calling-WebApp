import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  code?: string;
  title: string;
  description: string;
}

export default function ErrorPage({ code = "404", title, description }: Props) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden hero-bg">
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        <p className="font-mono text-sm text-primary">{code}</p>
        <h1 className="mt-3 text-6xl font-bold tracking-tight md:text-8xl gradient-text">{title}</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">{description}</p>
        <div className="mt-8 flex justify-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <a onClick={() => history.back()} href="#"><ArrowLeft className="mr-1.5 h-4 w-4" /> Go back</a>
          </Button>
          <Button asChild className="rounded-full bg-gradient-brand text-primary-foreground btn-glow">
            <Link to="/"><Home className="mr-1.5 h-4 w-4" /> Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
