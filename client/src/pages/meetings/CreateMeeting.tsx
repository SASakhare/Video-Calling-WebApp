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

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().trim().min(1, "Meeting title is required").max(120),
  description: z.string().max(500).optional(),
  date: z.date().optional(),
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

  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: "",
      passcodeEnabled: false,
      passcode: "",
      waitingRoom: false,
      autoRecord: false,
    },
  });

  const selectedDate = form.watch("date");
  const selectedTime = form.watch("time");

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  });

  const handleInstant = async (v: Values) => {
    setLoading(true);
    try {
      const data = {
        title: v.title,
        description: v.description,
        passcode: v.passcodeEnabled ? (v.passcode || undefined) : undefined,
        waitingRoom: v.waitingRoom,
        recording: v.autoRecord,
        type: "INSTANT",
      };

      console.log(data);

      const response = await meetingService.create(data);

      navigate(`/meetings/created/${response.data.meeting.meetingId}`, {
        state: { meeting: response.data.meeting },
      });
    } catch {
      toast.error("Failed to Create Instant Meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (v: Values) => {
    setLoading(true);
    try {
      // Combine date + time into a single ISO timestamp
      let scheduledStartTime: string | undefined;
      if (v.date && v.time) {
        const [hours, minutes] = v.time.split(":").map(Number);
        const combined = new Date(v.date);
        combined.setHours(hours, minutes, 0, 0);
        scheduledStartTime = combined.toISOString();
      }

      const data = {
        title: v.title,
        description: v.description,
        passcode: v.passcodeEnabled ? (v.passcode || undefined) : undefined,
        waitingRoom: v.waitingRoom,
        recording: v.autoRecord,
        scheduledStartTime,
        type: "SCHEDULED",
      };

      console.log(data);

      const response = await meetingService.create(data);

      navigate(`/meetings/created/${response.data.meeting.meetingId}`, {
        state: { meeting: response.data.meeting },
      });
    } catch {
      toast.error("Failed to Schedule Meeting");
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

      {/* //* Mode selector */}
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

      {/* //* Instant mode */}
      <form onSubmit={form.handleSubmit(handleInstant)} className="space-y-6">
        {mode === "instant" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
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
            </GlassCard>
            <GlassCard className="text-center mt-5">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <Radio className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold">Start an instant meeting</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Jump in immediately. Share the link with anyone you want to join.
              </p>
              <Button
                disabled={loading}
                type="submit"
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
      </form>

      {/* //* Scheduled mode */}
      {mode === "scheduled" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <form onSubmit={form.handleSubmit(handleSchedule)} className="space-y-6">
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
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Date
                  </Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-11 w-full justify-start rounded-xl text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            form.setValue("date", date, { shouldValidate: true });
                            setDateOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.date && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>

                {/* Time Picker */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    Time
                  </Label>
                  <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-11 w-full justify-start rounded-xl text-left font-normal",
                          !selectedTime && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {selectedTime || "Pick a time"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0" align="start">
                      <div className="max-h-64 overflow-y-auto py-1">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors",
                              selectedTime === slot && "bg-muted font-semibold"
                            )}
                            onClick={() => {
                              form.setValue("time", slot, { shouldValidate: true });
                              setTimeOpen(false);
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.time && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.time.message}
                    </p>
                  )}
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