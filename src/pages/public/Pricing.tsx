import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/GlassCard";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    tagline: "For personal use and casual meetings",
    features: ["Up to 100 participants", "40-min group meetings", "HD video", "In-meeting chat", "Screen sharing"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: { monthly: 12, yearly: 10 },
    tagline: "For growing teams that meet a lot",
    highlight: true,
    features: [
      "Everything in Starter", "Unlimited meeting length", "Cloud recordings (10 GB)",
      "AI recaps & transcripts", "Custom branding", "Priority support",
    ],
    cta: "Start Pro trial",
  },
  {
    name: "Business",
    price: { monthly: 24, yearly: 20 },
    tagline: "For organizations that need control",
    features: [
      "Everything in Pro", "SSO & SCIM", "Admin dashboard", "Regional data residency",
      "Audit logs", "Dedicated CSM",
    ],
    cta: "Contact sales",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="hero-bg">
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full">Pricing</Badge>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
            Fair pricing. <span className="gradient-text">No surprises.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Start free. Upgrade when you need to. Cancel anytime.
          </p>
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border/70 bg-background p-1">
            {(["monthly", "yearly"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setYearly(k === "yearly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  (k === "yearly") === yearly ? "bg-gradient-brand text-primary-foreground shadow-brand" : "text-muted-foreground"
                )}
              >
                {k === "yearly" ? "Yearly · save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlassCard
                className={cn(
                  "flex h-full flex-col",
                  p.highlight && "relative border-primary/40 shadow-brand ring-1 ring-primary/20"
                )}
              >
                {p.highlight && (
                  <Badge className="absolute -top-3 right-6 bg-gradient-brand text-primary-foreground">
                    <Sparkles className="mr-1 h-3 w-3" /> Most popular
                  </Badge>
                )}
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">
                    ${yearly ? p.price.yearly : p.price.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/ user / mo</span>
                </div>
                <Button
                  asChild
                  className={cn(
                    "mt-6 w-full rounded-full",
                    p.highlight && "bg-gradient-brand text-primary-foreground btn-glow"
                  )}
                  variant={p.highlight ? "default" : "outline"}
                >
                  <Link to="/register">{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-3 border-t border-border/60 pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
