import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
    /** value in "yyyy-MM-ddTHH:mm" format (same as datetime-local) */
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const hh = hours.toString().padStart(2, "0");
    return `${hh}:${minutes}`;
});

export function DateTimePicker({
    value,
    onChange,
    disabled,
    error,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);

    const selectedDate = value ? new Date(value) : undefined;
    const isValidDate = selectedDate && isValid(selectedDate);

    const currentTime = isValidDate ? format(selectedDate, "HH:mm") : "";

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;

        const time = currentTime || "10:00";
        const [h, m] = time.split(":");
        date.setHours(Number(h), Number(m), 0, 0);

        onChange(format(date, "yyyy-MM-dd'T'HH:mm"));
    };

    const handleTimeSelect = (time: string) => {
        const base = isValidDate ? selectedDate : new Date();
        const [h, m] = time.split(":");
        const next = new Date(base);
        next.setHours(Number(h), Number(m), 0, 0);

        onChange(format(next, "yyyy-MM-dd'T'HH:mm"));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <button
                    type="button"
                    className={cn(
                        "flex h-11 w-full items-center gap-2.5 rounded-xl border bg-muted/40 px-3.5 text-sm transition-colors",
                        "hover:bg-muted/60",
                        error ? "border-destructive/60" : "border-border/60",
                        !isValidDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1 text-left truncate">
                        {isValidDate
                            ? format(selectedDate, "EEE, MMM d, yyyy")
                            : "Select a date"}
                    </span>
                    <span className="h-4 w-px bg-border/60" />
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className={cn(!isValidDate && "text-muted-foreground")}>
                        {isValidDate ? format(selectedDate, "h:mm a") : "--:--"}
                    </span>
                </button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 rounded-2xl border-border/60 overflow-hidden"
                align="start"
            >
                <div className="flex flex-col sm:flex-row">
                    <Calendar
                        mode="single"
                        selected={isValidDate ? selectedDate : undefined}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                    />

                    <div className="border-t sm:border-t-0 sm:border-l border-border/60 p-2 sm:w-40">
                        <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Time
                        </p>
                        <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5">
                            {TIME_SLOTS.map((time) => {
                                const active = currentTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => handleTimeSelect(time)}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                                            active
                                                ? "bg-gradient-brand text-primary-foreground shadow-brand"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        {format(parse(time, "HH:mm", new Date()), "h:mm a")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-border/60 p-2.5">
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        className="rounded-full bg-gradient-brand text-primary-foreground"
                        disabled={!isValidDate}
                        onClick={() => setOpen(false)}
                    >
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}