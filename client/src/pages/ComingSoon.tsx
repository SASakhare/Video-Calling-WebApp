import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";

interface Props {
  title: string;
  description?: string;
  backTo?: string;
  phase?: "Phase 2" | "Phase 3" | "Phase 4";
}

export default function ComingSoon({ title, description, backTo = "/dashboard", phase = "Phase 2" }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary">
            <Construction className="h-6 w-6" />
          </div>
          <Badge variant="outline" className="mb-3 rounded-full">
            <Sparkles className="mr-1 h-3 w-3" /> Ships in {phase}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{description}</p>}
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to={backTo}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-brand text-primary-foreground btn-glow">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
