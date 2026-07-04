import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar, Clock, Users, ArrowRight, Download, Share2,
  FileText, Play, CheckCircle2, ChevronRight, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GlassCard } from "@/components/common/GlassCard";
import { meetingService } from "@/services/meeting.service";

export default function MeetingSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const summaryQuery = useQuery({
    queryKey: ["meeting-summary", id],
    queryFn: () => meetingService.summary(id!),
    enabled: !!id,
  });

  const data = summaryQuery.data;

  const copySummaryLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Summary link copied to clipboard");
  };

  const handleDownloadTranscript = () => {
    if (!data) return;
    const content = data.transcript
      .map((t) => `[${t.time}] ${t.sender}: ${t.text}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${data.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transcript file downloaded");
  };

  if (summaryQuery.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg text-center py-20">
        <p className="text-muted-foreground">Meeting summary not found.</p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => navigate("/dashboard")}
        >
          Return to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 select-none">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-brand md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-2.5 rounded-full border-white/30 bg-white/10 text-primary-foreground">
              Meeting Recap
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{data.title}</h1>
            <p className="mt-2 text-sm text-primary-foreground/80 max-w-md">
              Hosted by {data.hostName} on {new Date(data.date).toLocaleDateString([], { dateStyle: "long" })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={copySummaryLink} variant="outline" className="rounded-full border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20">
              <Share2 className="mr-1.5 h-4 w-4" /> Share Summary
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="rounded-full bg-white text-primary hover:bg-white/95">
              Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid statistics summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Duration", value: `${data.durationMin} minutes`, icon: Clock },
          { label: "Attendees", value: `${data.attendees.length} people`, icon: Users },
          { label: "AI Action Items", value: `${data.actionItems.length} created`, icon: FileText },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="flex items-center gap-4 py-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary shrink-0">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold text-foreground/90 mt-0.5">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left / Center Panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Items list */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              AI Action Items
            </h2>
            <GlassCard className="p-5 space-y-3.5">
              {data.actionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/80">{item}</p>
                </div>
              ))}
            </GlassCard>
          </section>

          {/* Transcript preview panel */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Meeting Transcript
              </h2>
              <Button onClick={handleDownloadTranscript} variant="ghost" size="sm" className="text-primary hover:text-primary-deep text-xs font-semibold rounded-lg gap-1">
                <Download className="h-3.5 w-3.5" /> Download TXT
              </Button>
            </div>
            <GlassCard className="p-5 space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin">
              {data.transcript.map((line, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground/90">{line.sender}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{line.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground pl-1">{line.text}</p>
                </div>
              ))}
            </GlassCard>
          </section>
        </div>

        {/* Right Sidebar panels */}
        <div className="space-y-6">
          
          {/* Recording Player placeholder */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Recording
            </h2>
            <GlassCard className="p-2 overflow-hidden aspect-video relative group border border-white/5 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Play trigger overlay icon */}
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-brand z-20 group-hover:scale-105 transition-transform cursor-pointer">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>
              <span className="text-xs font-semibold text-white mt-3 z-20">Watch recording</span>
              <span className="text-[10px] text-white/60 mt-0.5 z-20">mp4 · 42.1 MB</span>
            </GlassCard>
          </section>

          {/* Attendees Grid Panel list */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Attendees ({data.attendees.length})
            </h2>
            <GlassCard className="p-4 space-y-3.5">
              {data.attendees.map((person) => {
                const initials = person.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                return (
                  <div key={person.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border/60">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback className="bg-gradient-brand text-[10px] text-white uppercase">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground/90 truncate">{person.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {person.isHost ? "Host" : "Participant"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </GlassCard>
          </section>
        </div>
      </div>

    </div>
  );
}
