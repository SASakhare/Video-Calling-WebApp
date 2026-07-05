import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Mic, MicOff, Camera, CameraOff, ArrowRight, ArrowLeft,
  Users, Calendar, Lock, Loader2, Sparkles, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { VideoPreview } from "@/components/meetings/VideoPreview";
import { DeviceSelector } from "@/components/meetings/DeviceSelector";
import { useMediaPreview } from "@/hooks/useMediaPreview";
import { meetingService } from "@/services/meeting.service";
import { useMeetingStore } from "@/store/meeting.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

export default function MeetingLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setSelectedCamera = useMeetingStore((s) => s.setSelectedCamera);
  const setSelectedMic = useMeetingStore((s) => s.setSelectedMic);

  const meeting = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.get(id!),
    enabled: !!id,
  });

  const participants = useQuery({
    queryKey: ["meeting", id, "participants"],
    queryFn: () => meetingService.participants(id!),
    enabled: !!id,
  });

  const {
    videoRef,
    devices,
    selectedCamera,
    selectedMic,
    micOn,
    cameraOn,
    audioLevel,
    error: mediaError,
    loading: mediaLoading,
    toggleMic,
    toggleCamera,
    switchDevice,
    stop,
  } = useMediaPreview();

  // Persist device choices to store for Phase 3
  useEffect(() => {
    if (selectedCamera) setSelectedCamera(selectedCamera);
    if (selectedMic) setSelectedMic(selectedMic);
  }, [selectedCamera, selectedMic, setSelectedCamera, setSelectedMic]);

  const handleJoin = () => {
    stop(); // Release media before navigating
    if (meeting.data?.waitingRoom) {
      navigate(`/meetings/waiting/${id}`);
    } else {
      navigate(`/meetings/room/${id}`);
    }
  };

  const handleBack = () => {
    stop();
    navigate(-1);
  };

  const m = meeting.data;
  const pList = participants.data?.slice(0, 5) ?? [];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center gap-8 px-4 py-8 lg:flex-row lg:gap-12">
      {/* //* Left — Video preview */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-2xl space-y-4 lg:flex-1"
      >
        {/* Video */}
        <div className="relative">
          {mediaLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-white/60" />
                <p className="mt-2 text-sm text-white/50">
                  Requesting camera access…
                </p>
              </div>
            </div>
          )}
          <VideoPreview
            videoRef={videoRef}
            cameraOn={cameraOn}
            micOn={micOn}
            audioLevel={audioLevel}
          />
        </div>

        {/* Media error */}
        {mediaError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <Shield className="mb-1 inline h-4 w-4 mr-1.5" />
            {mediaError}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* //* mic toggle button */}
          <Button
            onClick={toggleMic}
            variant="outline"
            size="lg"
            className={cn(
              "h-12 w-12 rounded-full p-0",
              !micOn &&
                "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
            )}
            title={micOn ? "Mute microphone" : "Unmute microphone"}
          >
            {micOn ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

        {/* // * Camera Toggle button */}
          <Button
            onClick={toggleCamera}
            variant="outline"
            size="lg"
            className={cn(
              "h-12 w-12 rounded-full p-0",
              !cameraOn &&
                "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
            )}
            title={cameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {cameraOn ? (
              <Camera className="h-5 w-5" />
            ) : (
              <CameraOff className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* //* Device selectors */}
        <div className="grid gap-2 sm:grid-cols-2">
          <DeviceSelector
            kind="videoinput"
            devices={devices}
            selected={selectedCamera}
            onSelect={(id) => switchDevice("videoinput", id)}
          />
          <DeviceSelector
            kind="audioinput"
            devices={devices}
            selected={selectedMic}
            onSelect={(id) => switchDevice("audioinput", id)}
          />
        </div>

        {/* Virtual background hint */}
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="rounded-full border-border/50 text-muted-foreground"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Virtual backgrounds — coming soon
          </Badge>
        </div>
      </motion.div>

      {/* //* Right — Meeting info & join */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-md space-y-5"
      >
        <div className="glass-panel space-y-5 p-6">
          {/* //* Meeting info */}
          {meeting.isLoading ? (
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-shimmer rounded-lg" />
              <div className="h-4 w-1/2 animate-shimmer rounded-lg" />
            </div>
          ) : m ? (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{m.title}</h1>
              {m.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {m.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Hosted by {m.hostName}
                </span>
                {m.scheduledAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(m.scheduledAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
            </div>
          ) : null}

          <Separator className="bg-border/60" />

          {/* Participants already in */}
          {pList.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Already in the meeting
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {pList.map((p) => (
                    <Avatar
                      key={p.id}
                      className="h-8 w-8 border-2 border-background"
                    >
                      <AvatarImage src={p.avatar} />
                      <AvatarFallback className="bg-gradient-brand text-[10px] text-primary-foreground">
                        {p.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {(participants.data?.length ?? 0) > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{(participants.data?.length ?? 0) - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* //* Passcode input (if meeting requires one) */}
          {m?.passcode && (
            <div className="space-y-1.5">
              <Label
                htmlFor="passcode"
                className="flex items-center gap-1.5 text-xs"
              >
                <Lock className="h-3 w-3 text-muted-foreground" />
                Meeting passcode
              </Label>
              <Input
                id="passcode"
                type="text"
                placeholder="Enter passcode"
                className="h-10 rounded-xl font-mono"
                defaultValue=""
              />
            </div>
          )}

          {/* Waiting room notice */}
          {m?.waitingRoom && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-400">
              <Shield className="mb-0.5 inline h-3.5 w-3.5 mr-1" />
              This meeting has a waiting room. The host will admit you.
            </div>
          )}

          {/* Join CTA */}
          <Button
            onClick={handleJoin}
            size="lg"
            className="h-12 w-full rounded-full bg-gradient-brand text-primary-foreground btn-glow"
          >
            Join now
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

          <button
            onClick={handleBack}
            className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        {/* Ready status */}
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {cameraOn && micOn
              ? "✨ You're looking great. Ready to join!"
              : !cameraOn && !micOn
                ? "Camera and mic are off. You can turn them on anytime."
                : !cameraOn
                  ? "Camera is off. You'll join with audio only."
                  : "Mic is muted. You can unmute after joining."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
