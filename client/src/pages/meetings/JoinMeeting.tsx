import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Video, ArrowRight, Loader2, Clock, Users, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/common/GlassCard";
import { MeetingCodeInput } from "@/components/meetings/MeetingCodeInput";
import { meetingService } from "@/services/meeting.service";
import { socketService } from "@/services/socket.service";
import { CLIENT_EVENTS } from "@/constants/socket.events";



export default function JoinMeeting() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const recent = useQuery({
    queryKey: ["meetings", "recent"],
    queryFn: meetingService.recent,
  });

  // * this is the handleJoin function :

  const handleJoin = async () => {
    if (!code || code.replace(/-/g, "").length < 3) {
      setError("Enter a valid meeting code");
      return;
    }
    setLoading(true);
    setError(null);
    try {

      const meetingId = searchParams.get("meetingId")
      // * make the socket connection :

      console.log('code :',code);
      
      socketService.connect();

      socketService.emit(CLIENT_EVENTS.MEETING_JOIN, {
        meetingId,
        passcode: code,
      })
      // navigate(`/meetings/lobby/${result.meetingId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Invalid or expired meeting code");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleJoin();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-brand md:p-10">
        <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />
        <div className="relative text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Video className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Join a meeting
          </h1>
          <p className="mx-auto mt-2 max-w-md text-primary-foreground/85">
            Enter the meeting code shared by the organizer.
          </p>
        </div>
      </div>

      {/* Code input */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="space-y-5">
          <div onKeyDown={handleKeyDown}>
            <MeetingCodeInput
              value={code}
              onChange={(v) => {
                setCode(v);
                setError(null);
              }}
              error={error}
              disabled={loading}
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={loading || code.replace(/-/g, "").length < 3}
            size="lg"
            className="h-12 w-full rounded-full bg-gradient-brand text-primary-foreground btn-glow"
          >
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Video className="mr-1.5 h-4 w-4" />
            )}
            Join meeting
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            The code looks like{" "}
            <span className="font-mono text-foreground/80">abc1-def2-ghi3</span>
          </p>
        </GlassCard>
      </motion.div>

      {/* //* Recent meetings as quick-join */}
      {recent.data && recent.data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Recent meetings
            </h2>
            <Badge variant="outline" className="rounded-full text-[10px]">
              Quick rejoin
            </Badge>
          </div>
          <div className="space-y-2">
            {recent.data.slice(0, 3).map((m, i) => (
              <motion.div
                key={m.meetingId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.04 }}
              >
                <GlassCard
                  hover
                  onClick={() => navigate(`/meetings/lobby/${m.meetingId}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{m.title}</h3>
                      <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {/* {m.durationMin} */}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {m.participantsCount}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 rounded-full"
                    >
                      Rejoin
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
