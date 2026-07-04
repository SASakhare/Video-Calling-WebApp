import { useState } from "react";
import {
  Mic, MicOff, Camera, CameraOff, Monitor, Hand,
  Smile, MessageSquare, Users, Circle, PhoneOff, LayoutGrid, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ControlBarProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  recording: boolean;
  chatOpen: boolean;
  participantsOpen: boolean;
  unreadCount: number;
  participantCount: number;
  layoutMode: "grid" | "speaker" | "presentation";
  meetingTimer: string;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleShare: () => void;
  onToggleHand: () => void;
  onToggleRecording: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onChangeLayout: (mode: "grid" | "speaker" | "presentation") => void;
  onSendReaction: (emoji: string) => void;
  onLeave: () => void;
}

const emojis = ["👏", "❤️", "😂", "🎉", "👍", "🔥", "😮", "🤔"];

export function ControlBar({
  micOn,
  cameraOn,
  screenSharing,
  handRaised,
  recording,
  chatOpen,
  participantsOpen,
  unreadCount,
  participantCount,
  layoutMode,
  meetingTimer,
  onToggleMic,
  onToggleCamera,
  onToggleShare,
  onToggleHand,
  onToggleRecording,
  onToggleChat,
  onToggleParticipants,
  onChangeLayout,
  onSendReaction,
  onLeave,
}: ControlBarProps) {
  const [reactionOpen, setReactionOpen] = useState(false);

  return (
    <div className="h-20 shrink-0 w-full bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 z-40 relative select-none">
      
      {/* Left panel duration timer info details */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="font-mono text-sm font-medium text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          {meetingTimer}
        </span>
        {recording && (
          <div className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-500 font-medium">
            <span className="animate-pulse flex h-2 w-2 rounded-full bg-red-500" />
            REC
          </div>
        )}
      </div>

      {/* Center panel media controllers */}
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <Button
          onClick={onToggleMic}
          variant="ghost"
          className={cn(
            "h-11 w-11 p-0 rounded-xl transition-all border border-white/5",
            micOn ? "bg-white/5 hover:bg-white/10 text-white" : "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30 hover:text-red-500"
          )}
        >
          {micOn ? <Mic className="h-[18px] w-[18px]" /> : <MicOff className="h-[18px] w-[18px]" />}
        </Button>

        <Button
          onClick={onToggleCamera}
          variant="ghost"
          className={cn(
            "h-11 w-11 p-0 rounded-xl transition-all border border-white/5",
            cameraOn ? "bg-white/5 hover:bg-white/10 text-white" : "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30 hover:text-red-500"
          )}
        >
          {cameraOn ? <Camera className="h-[18px] w-[18px]" /> : <CameraOff className="h-[18px] w-[18px]" />}
        </Button>

        <Button
          onClick={onToggleShare}
          variant="ghost"
          className={cn(
            "h-11 w-11 p-0 rounded-xl transition-all border border-white/5",
            screenSharing ? "bg-primary text-white border-primary/20" : "bg-white/5 hover:bg-white/10 text-white"
          )}
        >
          <Monitor className="h-[18px] w-[18px]" />
        </Button>

        <Button
          onClick={onToggleHand}
          variant="ghost"
          className={cn(
            "h-11 w-11 p-0 rounded-xl transition-all border border-white/5",
            handRaised ? "bg-amber-500 text-white border-amber-500/20" : "bg-white/5 hover:bg-white/10 text-white"
          )}
        >
          <Hand className="h-[18px] w-[18px]" />
        </Button>

        {/* Reaction Popover Selector */}
        <Popover open={reactionOpen} onOpenChange={setReactionOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 w-11 p-0 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white"
            >
              <Smile className="h-[18px] w-[18px]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1 bg-slate-900 border-white/10 rounded-xl shadow-glow mb-2">
            <div className="flex items-center gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSendReaction(emoji);
                    setReactionOpen(false);
                  }}
                  className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-xl transition-all active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Layout Switcher Trigger Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 w-11 p-0 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white"
            >
              <LayoutGrid className="h-[18px] w-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 rounded-xl shadow-glow mb-2">
            <DropdownMenuItem
              onClick={() => onChangeLayout("grid")}
              className={cn("rounded-lg focus:bg-white/10", layoutMode === "grid" && "text-primary")}
            >
              Grid View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChangeLayout("speaker")}
              className={cn("rounded-lg focus:bg-white/10", layoutMode === "speaker" && "text-primary")}
            >
              Speaker View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onChangeLayout("presentation")}
              className={cn("rounded-lg focus:bg-white/10", layoutMode === "presentation" && "text-primary")}
            >
              Presentation View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1 hidden sm:block" />

        {/* Record toggle */}
        <Button
          onClick={onToggleRecording}
          variant="ghost"
          className={cn(
            "h-11 w-11 p-0 rounded-xl transition-all border border-white/5 hidden sm:flex",
            recording ? "text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20" : "bg-white/5 hover:bg-white/10 text-white"
          )}
        >
          <Circle className={cn("h-[18px] w-[18px]", recording && "fill-red-500")} />
        </Button>
      </div>

      {/* Right panel side tabs buttons and Leave controller */}
      <div className="hidden sm:flex items-center gap-2">
        <Button
          onClick={onToggleChat}
          variant="ghost"
          className={cn(
            "h-11 px-4 gap-2 rounded-xl border border-white/5 text-white transition-all",
            chatOpen ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-semibold">Chat</span>
          {unreadCount > 0 && (
            <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-brand">
              {unreadCount}
            </span>
          )}
        </Button>

        <Button
          onClick={onToggleParticipants}
          variant="ghost"
          className={cn(
            "h-11 px-4 gap-2 rounded-xl border border-white/5 text-white transition-all",
            participantsOpen ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
          )}
        >
          <Users className="h-4 w-4" />
          <span className="text-xs font-semibold">People</span>
          <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/80">
            {participantCount}
          </span>
        </Button>

        <Button
          onClick={onLeave}
          variant="destructive"
          className="h-11 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-1.5 shadow-lg select-none pointer-events-auto"
        >
          <PhoneOff className="h-4 w-4" />
          <span>Leave</span>
        </Button>
      </div>

    </div>
  );
}
export default ControlBar;
