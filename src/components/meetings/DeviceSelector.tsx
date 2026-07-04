import { Camera, Mic, Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MediaDevice } from "@/hooks/useMediaPreview";

const icons = {
  videoinput: Camera,
  audioinput: Mic,
  audiooutput: Volume2,
} as const;

const labels = {
  videoinput: "Camera",
  audioinput: "Microphone",
  audiooutput: "Speaker",
} as const;

interface DeviceSelectorProps {
  kind: "videoinput" | "audioinput" | "audiooutput";
  devices: MediaDevice[];
  selected: string | null;
  onSelect: (deviceId: string) => void;
  className?: string;
}

export function DeviceSelector({
  kind,
  devices,
  selected,
  onSelect,
  className,
}: DeviceSelectorProps) {
  const Icon = icons[kind];
  const filtered = devices.filter((d) => d.kind === kind);

  if (filtered.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          No {labels[kind].toLowerCase()} found
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Select value={selected ?? undefined} onValueChange={onSelect}>
        <SelectTrigger className="h-10 rounded-xl border-border/60 bg-muted/40 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder={`Select ${labels[kind].toLowerCase()}`} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filtered.map((d) => (
            <SelectItem key={d.deviceId} value={d.deviceId}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
