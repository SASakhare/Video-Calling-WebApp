import { motion } from "framer-motion";
import {
  Video, Users, Shield, Sparkles, MonitorPlay, MessageSquare, Calendar,
  Mic, Zap, Globe, Lock, Palette, Puzzle, Boxes, Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";

const groups = [
  {
    title: "In-meeting",
    items: [
      { icon: Video, title: "1080p adaptive video" },
      { icon: Mic, title: "AI noise cancellation" },
      { icon: MonitorPlay, title: "Screen & window sharing" },
      { icon: MessageSquare, title: "Threaded chat" },
      { icon: Sparkles, title: "Live reactions & hand raise" },
      { icon: Users, title: "Breakout rooms" },
    ],
  },
  {
    title: "Scheduling & workflow",
    items: [
      { icon: Calendar, title: "Calendar integrations" },
      { icon: Bell, title: "Smart reminders" },
      { icon: Puzzle, title: "Slack, Notion, Linear" },
      { icon: Boxes, title: "Meeting templates" },
      { icon: Palette, title: "Custom branding" },
      { icon: Zap, title: "One-click join" },
    ],
  },
  {
    title: "Security & admin",
    items: [
      { icon: Shield, title: "End-to-end encryption" },
      { icon: Lock, title: "SSO & SCIM" },
      { icon: Users, title: "Role-based access" },
      { icon: Globe, title: "Regional data residency" },
      { icon: MonitorPlay, title: "Session recording" },
      { icon: Bell, title: "Audit logs" },
    ],
  },
];

export default function Features() {
  return (
    <div className="hero-bg">
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full">Features</Badge>
          <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
            A meeting platform, <span className="gradient-text">reimagined</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Every detail obsessed over — so you can focus on the conversation, not the tool.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {groups.map((g, gi) => (
            <div key={g.title}>
              <h2 className="mb-6 text-2xl font-semibold tracking-tight">{g.title}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it, i) => (
                  <motion.div
                    key={it.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: (gi + i) * 0.03 }}
                  >
                    <GlassCard hover className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
                        <it.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{it.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Built into every plan. Nothing to configure.
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
