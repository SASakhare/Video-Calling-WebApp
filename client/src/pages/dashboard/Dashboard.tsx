import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Video, Plus, Calendar, Clock, Users, ArrowRight, PlayCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { meetingService } from "@/services/meeting.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const upcoming = useQuery({ queryKey: ["meetings", "upcoming"], queryFn: meetingService.upcoming });
  const recent = useQuery({ queryKey: ["meetings", "recent"], queryFn: meetingService.recent });

  const first = (user?.firstName || "there").split(" ")[0];
  const personalRoom = `meetly.app/${(user?.firstName || "you").toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-brand md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-primary-foreground/80">Good to see you,</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{first} 👋</h1>
            <p className="mt-2 max-w-md text-primary-foreground/85">Start a new meeting, or jump into one scheduled for today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* //* button for start new meeting */}
            <Button size="lg" variant="secondary" className="rounded-full" onClick={() => navigate("/meetings/new")}>
              <Plus className="mr-1.5 h-4 w-4" /> New meeting
            </Button>
            
            {/* //* button for join meeting */}
            <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground" onClick={() => navigate("/meetings/join")}>
              <Video className="mr-1.5 h-4 w-4" /> Join with code
            </Button>

          </div>
        </div>
      </div>

      {/* //* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* //* we have to change this stats from static to dynamics */}
        {[
          { label: "Meetings today", value: "3", icon: Calendar },
          { label: "Hours this week", value: "8.4", icon: Clock },
          { label: "Active teammates", value: "24", icon: Users },
          { label: "Recordings", value: "12", icon: PlayCircle },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* //* Personal room */}
      <GlassCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge variant="outline" className="mb-2 rounded-full">Personal room</Badge>
          <p className="font-mono text-sm text-foreground/90">{personalRoom}</p>
          <p className="mt-1 text-xs text-muted-foreground">Your always-on meeting URL. Share it once, use it forever.</p>
        </div>
        <div className="flex gap-2">

          <Button variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(personalRoom); toast.success("Copied to clipboard"); }}>
            <Copy className="mr-1.5 h-4 w-4" /> Copy
          </Button>

          <Button className="rounded-full bg-gradient-brand text-primary-foreground btn-glow" onClick={() => navigate("/meetings/new")}>
            Start now <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

        </div>
      </GlassCard>

      {/* //* Upcoming + Recent */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* //* Upcoming Events */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>View all</Button>
          </div>
          <div className="space-y-3">
            {upcoming.isLoading ? (
              [1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : upcoming.data && upcoming.data.length ? (
              upcoming.data.map((m) => (
                <GlassCard key={m.id} hover onClick={() => navigate(`/meetings/lobby/${m.id}`)} className="cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{m.title}</h3>
                      <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{m.scheduledAt && new Date(m.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{m.participantsCount}</span>
                      </p>
                    </div>
                    <Button size="sm" className="rounded-full bg-gradient-brand text-primary-foreground">Join</Button>
                  </div>
                </GlassCard>
              ))
            ) : (
              <EmptyState icon={<Calendar className="h-5 w-5" />} title="Nothing scheduled" description="Create a meeting to see it here." />
            )}
          </div>
        </section>

        {/* //* Recent Events */}
        <section>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>View all</Button>
          </div>
          <div className="space-y-3">
            {recent.isLoading ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : recent.data && recent.data.length ? (
              recent.data.map((m) => (
                <GlassCard key={m.id} hover onClick={() => navigate(`/meetings/summary/${m.id}`)} className="cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{m.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.durationMin}m · {m.participantsCount} participants {m.recording && "· 🎥 recorded"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </GlassCard>
              ))
            ) : (
              <EmptyState icon={<Clock className="h-5 w-5" />} title="No history yet" description="Your past meetings will appear here." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
