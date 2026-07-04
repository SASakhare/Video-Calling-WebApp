import type { Invitation } from "@/types";
import { delay, uid } from "./_mock";

export const invitationService = {
  async send(meetingId: string, emails: string[]): Promise<Invitation[]> {
    await delay();
    return emails.map((email) => ({
      id: uid(),
      meetingId,
      email,
      status: "pending" as const,
      sentAt: new Date().toISOString(),
    }));
  },
  async list(meetingId: string): Promise<Invitation[]> {
    await delay(300);
    return [
      { id: "i1", meetingId, email: "priya@meetly.app", status: "accepted", sentAt: new Date(Date.now() - 3600e3).toISOString() },
      { id: "i2", meetingId, email: "jordan@meetly.app", status: "accepted", sentAt: new Date(Date.now() - 3200e3).toISOString() },
      { id: "i3", meetingId, email: "sam@meetly.app", status: "pending", sentAt: new Date(Date.now() - 1200e3).toISOString() },
      { id: "i4", meetingId, email: "mika@meetly.app", status: "declined", sentAt: new Date(Date.now() - 600e3).toISOString() },
    ];
  },
  async resend(id: string) { await delay(300); return { ok: true, id }; },
  async cancel(id: string) { await delay(300); return { ok: true, id }; },
};
