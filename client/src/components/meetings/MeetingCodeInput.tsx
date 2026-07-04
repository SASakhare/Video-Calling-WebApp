import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MeetingCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  className?: string;
  disabled?: boolean;
}

export function MeetingCodeInput({
  value,
  onChange,
  error,
  className,
  disabled,
}: MeetingCodeInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Strip everything except alphanumeric
      const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      // Format as xxxx-xxxx-xxxx
      const parts: string[] = [];
      for (let i = 0; i < raw.length && i < 12; i += 4) {
        parts.push(raw.slice(i, i + 4));
      }
      onChange(parts.join("-"));
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="xxxx-xxxx-xxxx"
        maxLength={14}
        disabled={disabled}
        className={cn(
          "h-14 rounded-2xl border-border/60 bg-muted/40 text-center font-mono text-2xl tracking-[0.15em] placeholder:text-muted-foreground/40",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        autoComplete="off"
        spellCheck={false}
      />
      {error && (
        <p className="text-center text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
