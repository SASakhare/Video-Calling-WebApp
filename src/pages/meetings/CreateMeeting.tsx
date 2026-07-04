import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Video, Calendar, Clock, Lock, Users, Shield, Zap,
  ArrowRight, Loader2, Sparkles, Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlassCard } from "@/components/common/GlassCard";
import { InvitationsModal } from "@/components/meetings/InvitationsModal";
import { meetingService } from "@/services/meeting.service";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(1, "Meeting title is required").max(120),
  description: z.string().max(500).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  passcodeEnabled: z.boolean(),
  passcode: z.string().optional(),
  waitingRoom: z.boolean(),
  autoRecord: z.boolean(),
});
type Values = z.infer<typeof schema>;

export default function CreateMeeting() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<"instant" | "scheduled">("instant");
  const [loading, setLoading] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      passcodeEnabled: false,
      passcode: "",
      waitingRoom: false,
      autoRecord: false,
    },
  });

  const handleInstant = async () => {
    setLoading(true);
    try {
      const result = await meetingService.create({
        title: `${user?.name?.split(" ")[0] ?? "Quick"}'s meeting`,
        hostId: user?.id ?? "u_1",
        hostName: user?.name ?? "You",
        status: "scheduled",
        participantsCount: 1,
      });
      toast.success("Meeting created!");
      navigate(`/meetings/created/${result.id}`, {
        state: { meeting: result },
      });
    } catch {
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (v: Values) => {
    setLoading(true);
    try {
      const scheduledAt = v.date && v.time
        ? new Date(`${v.date}T${v.time}`).toISOString()
        : new Date().toISOString();

      const result = await meetingService.create({
        title: v.title,
        description: v.description,
        hostId: user?.id ?? "u_1",
        hostName: user?.name ?? "You",
        status: "scheduled",
        scheduledAt,
        participantsCount: 1,
        passcode: v.passcodeEnabled ? (v.passcode || undefined) : undefined,
        waitingRoom: v.waitingRoom,
        recording: v.autoRecord,
      });
      setCreatedMeetingId(result.id);
      toast.success("Meeting scheduled!");
      navigate(`/meetings/created/${result.id}`, {
        state: { meeting: result },
      });
    } catch {
      toast.error("Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  const passcodeEnabled = form.watch("passcodeEnabled");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-brand md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />
        <div className="relative">
          <p className="text-sm text-primary-foreground/80">Create</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            New meeting
          </h1>
          <p className="mt-2 max-w-md text-primary-foreground/85">
            Start an instant meeting or schedule one for later.
          </p>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-3">
        {[
          { key: "instant" as const, icon: Zap, label: "Instant meeting", desc: "Start right now" },
          { key: "scheduled" as const, icon: Calendar, label: "Schedule", desc: "Pick a date & time" },
        ].map((m) => (
          <motion.button
            key={m.key}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode(m.key)}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all",
              mode === m.key
                ? "border-primary/40 bg-primary/5 shadow-md ring-1 ring-primary/20"
                : "border-border/60 bg-muted/30 hover:border-border"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                mode === m.key
                  ? "bg-gradient-brand text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <m.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Instant mode */}
      {mode === "instant" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
              <Radio className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold">Start an instant meeting</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Jump in immediately. Share the link with anyone you want to join.
            </p>
            <Button
              onClick={handleInstant}
              disabled={loading}
              size="lg"
              className="mt-6 h-12 rounded-full bg-gradient-brand px-8 text-primary-foreground btn-glow"
            >
              {loading ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Video className="mr-1.5 h-4 w-4" />
              )}
              Start now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </GlassCard>
        </motion.div>
      )}

      {/* Scheduled mode */}
      {mode === "scheduled" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Q3 Product Review"
                  className="h-11 rounded-xl"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="desc">
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Agenda, notes, or context for attendees..."
                  className="min-h-[80px] rounded-xl resize-none"
                  {...form.register("description")}
                />
              </div>

              {/* Date & Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="h-11 rounded-xl"
                    min={new Date().toISOString().split("T")[0]}
                    {...form.register("date")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    className="h-11 rounded-xl"
                    {...form.register("time")}
                  />
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Options */}
              <div className="space-y-4">
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Meeting options
                </p>

                {/* Passcode */}
                <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Require passcode</p>
                      <p className="text-xs text-muted-foreground">
                        Participants must enter a code to join
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={passcodeEnabled}
                    onCheckedChange={(v) =>
                      form.setValue("passcodeEnabled", v)
                    }
                  />
                </div>
                {passcodeEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pl-11"
                  >
                    <Input
                      placeholder="Auto-generated if empty"
                      className="h-10 max-w-xs rounded-xl font-mono"
                      {...form.register("passcode")}
                    />
                  </motion.div>
                )}

                {/* Waiting room */}
                <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Waiting room</p>
                      <p className="text-xs text-muted-foreground">
                        Admit participants manually
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={form.watch("waitingRoom")}
                    onCheckedChange={(v) =>
                      form.setValue("waitingRoom", v)
                    }
                  />
                </div>

                {/* Auto record */}
                <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Auto-record</p>
                      <p className="text-xs text-muted-foreground">
                        Start recording when the meeting begins
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={form.watch("autoRecord")}
                    onCheckedChange={(v) =>
                      form.setValue("autoRecord", v)
                    }
                  />
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="h-12 rounded-full bg-gradient-brand px-6 text-primary-foreground btn-glow"
                >
                  {loading ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Calendar className="mr-1.5 h-4 w-4" />
                  )}
                  Schedule meeting
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full px-6"
                  onClick={() => {
                    // Use a placeholder ID for pre-creation invites
                    setCreatedMeetingId("m_preview");
                    setInviteOpen(true);
                  }}
                >
                  <Users className="mr-1.5 h-4 w-4" />
                  Invite people
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Invitations modal */}
      <InvitationsModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        meetingId={createdMeetingId ?? "m_preview"}
      />
    </div>
  );
}
