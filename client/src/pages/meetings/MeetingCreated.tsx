import { useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CheckCircle2, Copy, Link as LinkIcon, ArrowRight, Calendar,
  Users, Download, ExternalLink, Lock, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlassCard } from "@/components/common/GlassCard";
import { InvitationsModal } from "@/components/meetings/InvitationsModal";
import { meetingService } from "@/services/meeting.service";

export default function MeetingCreated() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);

  console.log(location.state);
  
  // Try state from navigation first, fall back to fetch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const passedMeeting = (location.state as any)?.meeting;

  const fetched = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.get(id!),
    enabled: !passedMeeting && !!id,
  });

  const meeting = passedMeeting || fetched.data;
  const meetingCode = passedMeeting?.code || id;
  const meetingLink = `meetly.app/join/${meetingCode}`;

  const inviteText = useMemo(() => {
    if (!meeting) return "";
    const lines = [
      `You're invited to "${meeting.title}" on Meetly.`,
      "",
      `Join: https://${meetingLink}`,
    ];
    if (meeting.passcode) lines.push(`Passcode: ${meeting.passcode}`);
    if (meeting.scheduledAt) {
      lines.push(
        `When: ${new Date(meeting.scheduledAt).toLocaleString([], {
          dateStyle: "full",
          timeStyle: "short",
        })}`
      );
    }
    return lines.join("\n");
  }, [meeting, meetingLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${meetingLink}`);
    toast.success("Meeting link copied");
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteText);
    toast.success("Invitation text copied");
  };

  const downloadIcs = () => {
    if (!meeting) return;
    const blob = meetingService.generateCalendarEvent({
      ...meeting,
      code: meetingCode,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meeting.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calendar file downloaded");
  };

  const openGoogleCal = () => {
    if (!meeting) return;
    const url = meetingService.generateGoogleCalendarUrl({
      ...meeting,
      code: meetingCode,
    });
    window.open(url, "_blank");
  };

  if (!meeting && fetched.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="mx-auto max-w-lg text-center py-20">
        <p className="text-muted-foreground">Meeting not found.</p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => navigate("/dashboard")}
        >
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* //* Success hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-center text-primary-foreground shadow-brand md:p-12"
      >
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />

        {/* //* Celebration rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.6, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border-2 border-white/30"
            />
          ))}
        </div>

        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Meeting created!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-primary-foreground/85">
            Share the details below with your participants.
          </p>
        </div>
      </motion.div>

      {/* Meeting details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <GlassCard className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{meeting.title}</h2>
              {meeting.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {meeting.description}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className="shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Confirmed
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {meeting.scheduledAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(meeting.scheduledAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {meeting.participantsCount} participant
              {meeting.participantsCount !== 1 ? "s" : ""}
            </span>
            {meeting.passcode && (
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Passcode: <span className="font-mono">{meeting.passcode}</span>
              </span>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Meeting link */}
          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
            <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate font-mono text-sm">
              {meetingLink}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
              onClick={copyLink}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Share actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid gap-3 sm:grid-cols-2"
      >
        {/* // *Copy Invitation */}
        <GlassCard
          hover
          onClick={copyInvite}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Copy invitation</p>
              <p className="text-xs text-muted-foreground">
                Pre-formatted message with link
              </p>
            </div>
          </div>
        </GlassCard>

        {/* // *Send Invitation */}

        <GlassCard
          hover
          onClick={() => setInviteOpen(true)}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Send invitations</p>
              <p className="text-xs text-muted-foreground">
                Invite by email address
              </p>
            </div>
          </div>
        </GlassCard>

        {/* // *Download .ics */}

        <GlassCard
          hover
          onClick={downloadIcs}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Download .ics</p>
              <p className="text-xs text-muted-foreground">
                Outlook, Apple Calendar, etc.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* // * Google Calendar */}
        <GlassCard
          hover
          onClick={openGoogleCal}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand-soft text-primary">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Google Calendar</p>
              <p className="text-xs text-muted-foreground">
                Open in a new tab
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/*//* Primary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-center"
      >
        <Button
          onClick={() => navigate(`/meetings/lobby/${id}`)}
          size="lg"
          className="h-12 rounded-full bg-gradient-brand px-8 text-primary-foreground btn-glow"
        >
          Go to lobby
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Invitations modal */}
      <InvitationsModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        meetingId={id!}
      />
    </div>
  );
}
