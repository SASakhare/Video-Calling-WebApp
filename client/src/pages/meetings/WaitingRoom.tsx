import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Mic, MicOff, Camera, CameraOff, LogOut, Shield, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/meetings/VideoPreview";
import { useMediaPreview } from "@/hooks/useMediaPreview";
import { meetingService } from "@/services/meeting.service";
import { cn } from "@/lib/utils";

const AUTO_ADMIT_MS = 5000;

export default function WaitingRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admitted, setAdmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const meeting = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.get(id!),
    enabled: !!id,
  });

  const {
    videoRef,
    micOn,
    cameraOn,
    audioLevel,
    toggleMic,
    toggleCamera,
    stop,
  } = useMediaPreview();

  //* Auto-admit simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAdmitted(true);
      toast.success("The host has admitted you", {
        description: "Joining the meeting room…",
      });
      setTimeout(() => {
        stop();
        navigate(`/meetings/room/${id}`);
      }, 1200);
    }, AUTO_ADMIT_MS);

    return () => clearTimeout(timer);
  }, [id, navigate, stop]);

  //* Elapsed counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLeave = () => {
    stop();
    navigate("/dashboard");
    toast("You left the waiting room");
  };

  const m = meeting.data;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-50" />
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-md space-y-6 text-center"
      >
        {/* //* Pulsing indicator */}
        <div className="relative mx-auto h-20 w-20">
          {!admitted ? (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-primary/40"
                  animate={{
                    scale: [1, 2],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-brand shadow-brand">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500 shadow-lg"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
          )}
        </div>

        {/* //* Status text */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {admitted ? "You've been admitted!" : "Waiting to be admitted"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {admitted
              ? "Joining the meeting room now…"
              : "The host will let you in shortly."}
          </p>
          {m && (
            <p className="mt-1 text-sm font-medium">
              {m.title}
              <span className="text-muted-foreground"> · {m.hostName}</span>
            </p>
          )}
        </div>

        {/* //* Elapsed time */}
        {!admitted && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Waiting {formatTime(elapsed)}
          </div>
        )}

        {/*  //*Self-view */}
        {!admitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <VideoPreview
              videoRef={videoRef}
              cameraOn={cameraOn}
              micOn={micOn}
              audioLevel={audioLevel}
              compact
              className="mx-auto"
            />

            {/*//* Controls */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button
                onClick={toggleMic}
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  !micOn &&
                    "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                )}
                title={micOn ? "Mute" : "Unmute"}
              >
                {micOn ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={toggleCamera}
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  !cameraOn &&
                    "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                )}
                title={cameraOn ? "Camera off" : "Camera on"}
              >
                {cameraOn ? (
                  <Camera className="h-4 w-4" />
                ) : (
                  <CameraOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* //* Leave button */}
        {!admitted && (
          <Button
            onClick={handleLeave}
            variant="outline"
            className="rounded-full"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Leave waiting room
          </Button>
        )}
      </motion.div>
    </div>
  );
}
