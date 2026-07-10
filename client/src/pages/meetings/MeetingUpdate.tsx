import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    ArrowLeft,
    CalendarDays,
    Loader2,
    Save,
    Users,
    Lock,
    DoorOpen,
    Zap,
    Clock,
} from "lucide-react";
// add this import near the top with your other component imports
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { format, isValid as isValidDateFn } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/common/LoadingSkeleton";
import { GlassCard } from "@/components/common/GlassCard";

import { meetingService } from "@/services/meeting.service";
import { useMeetingStore } from "@/store/meeting.store";
import {
    meetingSchema,
    type MeetingFormValues,
} from "@/schemas/meeting.schema";
import type { Meeting } from "@/types";

export default function EditMeetingPage() {
    const navigate = useNavigate();
    const { meetingId } = useParams();

    const meetings = useMeetingStore((state) => state.meetings);
    const updateMeetingInStore = useMeetingStore((state) => state.updateMeeting);

    const localMeeting = meetings.find((m) => m.meetingId === meetingId);

    const meetingQuery = useQuery({
        queryKey: ["meeting", meetingId],
        queryFn: () => meetingService.get(meetingId!),
        enabled: !!meetingId && !localMeeting,
    });

    const meeting = localMeeting ?? meetingQuery.data;

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        trigger,
        setValue,
        clearErrors,
        formState: { errors, isDirty },
    } = useForm<MeetingFormValues>({
        resolver: zodResolver(meetingSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            type: "SCHEDULED",
            scheduledStartTime: "",
            participantLimit: 100,
            waitingRoomEnabled: false,
            passwordProtected: false,
            meetingPassword: "",
        },
    });

    const watchType = watch("type");
    const watchPasswordProtected = watch("passwordProtected");

    useEffect(() => {
        if (!meeting) return;

        reset({
            title: meeting.title,
            description: meeting.description ?? "",
            type: meeting.type,
            scheduledStartTime: meeting.scheduledStartTime
                ? meeting.scheduledStartTime.slice(0, 16)
                : "",
            participantLimit: meeting.participantLimit,
            waitingRoomEnabled: meeting.waitingRoomEnabled,
            passwordProtected: !!meeting.meetingPassword,
            meetingPassword: meeting.meetingPassword ?? "",
        });

        // Ensure any stale/invalid pre-filled values surface errors immediately
        trigger();
    }, [meeting, reset, trigger]);

    const updateMutation = useMutation({
        mutationFn: meetingService.update,
        onSuccess: (updated: Meeting) => {
            updateMeetingInStore(updated);
            toast.success("Meeting updated successfully");
            navigate("/meetings/history");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ?? "Failed to update meeting"
            );
        },
    });

    const onSubmit = (values: MeetingFormValues) => {
        updateMutation.mutate({
            meetingId: meetingId!,
            title: values.title,
            description: values.description || undefined,
            type_: values.type,
            scheduledStartTime:
                values.type === "SCHEDULED"
                    ? new Date(values.scheduledStartTime!).toISOString()
                    : undefined,
            participantLimit: values.participantLimit,
            waitingRoomEnabled: values.waitingRoomEnabled,
            meetingPassword: values.passwordProtected ? values.meetingPassword : undefined,
        });
    };

    const onInvalid = (invalidErrors: typeof errors) => {
        console.log("VALIDATION FAILED:", invalidErrors);
    };

    // ---------------- Loading ----------------
    if (meetingQuery.isLoading && !localMeeting) {
        return (
            <div className="mx-auto max-w-5xl space-y-6">
                <Skeleton className="h-10 w-52 rounded-xl" />
                <Skeleton className="h-[550px] rounded-3xl" />
            </div>
        );
    }

    // ---------------- Not Found ----------------
    if (!meeting) {
        return (
            <GlassCard className="mx-auto max-w-xl p-10 text-center space-y-4">
                <h2 className="text-2xl font-semibold">Meeting not found</h2>
                <p className="text-sm text-muted-foreground">
                    This meeting may have been removed or the link is invalid.
                </p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </GlassCard>
        );
    }

    // ---------------- Locked statuses ----------------
    const isLocked =
        meeting.status === "LIVE" ||
        meeting.status === "ENDED" ||
        meeting.status === "CANCELLED";

    if (isLocked) {
        return (
            <GlassCard className="mx-auto max-w-xl p-10 text-center space-y-4">
                <h2 className="text-2xl font-semibold">This meeting can't be edited</h2>
                <p className="text-sm text-muted-foreground">
                    Meetings that are live, ended, or cancelled can no longer be modified.
                </p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </GlassCard>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl space-y-8 pb-16"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Edit Meeting
                    </h1>

                    <p className="text-muted-foreground mt-1 text-sm">
                        Update your meeting details before participants join.
                    </p>
                </div>

                <CalendarDays className="h-12 w-12 text-primary hidden sm:block" />
            </div>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                {/* ---------------- Meeting Information ---------------- */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Meeting Information
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Meeting Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Team Weekly Sync"
                            className="rounded-xl border-border/60 bg-muted/40 h-11"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What's this meeting about?"
                            rows={4}
                            className="rounded-xl border-border/60 bg-muted/40 resize-none"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </GlassCard>

                {/* ---------------- Schedule ---------------- */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Schedule
                        </h2>
                    </div>

                    <div className="space-y-2">
                        <Label>Meeting Type</Label>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <div className="flex gap-2">
                                    {(["SCHEDULED", "INSTANT"] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                field.onChange(t);
                                                trigger("scheduledStartTime");
                                            }}
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${field.value === t
                                                ? "bg-gradient-brand text-primary-foreground shadow-brand"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            {t === "SCHEDULED" ? "Scheduled" : "Instant"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    {watchType === "SCHEDULED" && (
                        <div className="space-y-2">
                            <Label htmlFor="scheduledStartTime">Start Date & Time</Label>

                            <Controller
                                control={control}
                                name="scheduledStartTime"
                                render={({ field }) => (
                                    <div className="max-w-sm">
                                        <DateTimePicker
                                            value={field.value ?? ""}
                                            onChange={(val) => {
                                                field.onChange(val);
                                                trigger("scheduledStartTime");
                                            }}
                                            error={!!errors.scheduledStartTime}
                                        />
                                    </div>
                                )}
                            />

                            {errors.scheduledStartTime && (
                                <p className="text-xs text-destructive">
                                    {errors.scheduledStartTime.message}
                                </p>
                            )}

                            {/* Previously scheduled time preview */}
                            {meeting.scheduledStartTime &&
                                isValidDateFn(new Date(meeting.scheduledStartTime)) && (
                                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                        Originally scheduled for{" "}
                                        <span className="font-medium text-foreground">
                                            {format(
                                                new Date(meeting.scheduledStartTime),
                                                "EEE, MMM d, yyyy 'at' h:mm a"
                                            )}
                                        </span>
                                    </div>
                                )}
                        </div>
                    )}
                </GlassCard>
                {/* ---------------- Meeting Settings ---------------- */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Meeting Settings
                        </h2>
                    </div>

                    <div className="space-y-2 max-w-xs">
                        <Label htmlFor="participantLimit">Participant Limit</Label>
                        <Input
                            id="participantLimit"
                            type="number"
                            min={2}
                            max={500}
                            className="rounded-xl border-border/60 bg-muted/40 h-11"
                            {...register("participantLimit", { valueAsNumber: true })}
                        />
                        {errors.participantLimit && (
                            <p className="text-xs text-destructive">
                                {errors.participantLimit.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <DoorOpen className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Waiting Room</p>
                                <p className="text-xs text-muted-foreground">
                                    Host must admit participants before they join.
                                </p>
                            </div>
                        </div>
                        <Controller
                            control={control}
                            name="waitingRoomEnabled"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                </GlassCard>
                {/* ---------------- Security ---------------- */}
                <GlassCard className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Security
                        </h2>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium">Password Protected</p>
                            <p className="text-xs text-muted-foreground">
                                Require a password for participants to join.
                            </p>
                        </div>
                        <Controller
                            control={control}
                            name="passwordProtected"
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);

                                        if (!checked) {
                                            // clear value + wipe any stale error immediately
                                            setValue("meetingPassword", "", {
                                                shouldValidate: false,
                                            });
                                            clearErrors("meetingPassword");
                                        } else {
                                            trigger("meetingPassword");
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>

                    {watchPasswordProtected && (
                        <div className="space-y-2 max-w-xs">
                            <Label htmlFor="meetingPassword">Meeting Password</Label>
                            <Input
                                id="meetingPassword"
                                type="text"
                                placeholder="Enter password"
                                className="rounded-xl border-border/60 bg-muted/40 h-11"
                                {...register("meetingPassword")}
                            />
                            {errors.meetingPassword && (
                                <p className="text-xs text-destructive">
                                    {errors.meetingPassword.message}
                                </p>
                            )}
                        </div>
                    )}
                </GlassCard>
                {/* ---------------- Footer ---------------- */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="rounded-full bg-gradient-brand text-primary-foreground shadow-brand btn-glow"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}