import { z } from "zod";

export const meetingSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(100, "Title must be under 100 characters"),

        description: z
            .string()
            .trim()
            .max(500, "Description must be under 500 characters")
            .optional()
            .or(z.literal("")),

        type: z.enum(["INSTANT", "SCHEDULED"]),

        scheduledStartTime: z.string().optional().or(z.literal("")),

        participantLimit: z
            .number({ invalid_type_error: "Participant limit is required" })
            .min(2, "Minimum 2 participants required")
            .max(500, "Maximum 500 participants allowed"),

        waitingRoomEnabled: z.boolean(),

        passwordProtected: z.boolean(),

        meetingPassword: z
            .string()
            .trim()
            .max(20, "Password must be under 20 characters")
            .optional()
            .or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        if (data.type === "SCHEDULED" && !data.scheduledStartTime) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Scheduled start time is required for scheduled meetings",
                path: ["scheduledStartTime"],
            });
        }

        if (data.type === "SCHEDULED" && data.scheduledStartTime) {
            const selected = new Date(data.scheduledStartTime).getTime();
            if (Number.isNaN(selected)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid date",
                    path: ["scheduledStartTime"],
                });
            }
            // Note: no "must be in the future" check here — that would block
            // editing meetings whose original scheduled time has already passed.
        }

        if (data.passwordProtected) {
            if (!data.meetingPassword || data.meetingPassword.length < 4) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must be at least 4 characters",
                    path: ["meetingPassword"],
                });
            }
        }
    });

export type MeetingFormValues = z.infer<typeof meetingSchema>;