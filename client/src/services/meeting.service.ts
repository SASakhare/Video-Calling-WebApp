import type { Meeting, Participant, ChatMessage } from "@/types";
import { delay, uid, meetingCode } from "./_mock";

const now = Date.now();
const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();

const seedMeetings: Meeting[] = [
  {
    id: "m_1", title: "Q3 Product Review", hostId: "u_1", hostName: "Alex Rivera",
    status: "scheduled", scheduledAt: iso(3 * 3600e3), participantsCount: 12,
    description: "Roadmap alignment and shipping plan.",
  },
  {
    id: "m_2", title: "Design Sync — Meeting Room v2", hostId: "u_2", hostName: "Priya Shah",
    status: "scheduled", scheduledAt: iso(26 * 3600e3), participantsCount: 6,
  },
  {
    id: "m_3", title: "Weekly All-Hands", hostId: "u_1", hostName: "Alex Rivera",
    status: "ended", startedAt: iso(-2 * 864e5), endedAt: iso(-2 * 864e5 + 55 * 60e3),
    durationMin: 55, participantsCount: 84, recording: true,
  },
  {
    id: "m_4", title: "Customer Interview — Northwind", hostId: "u_1", hostName: "Alex Rivera",
    status: "ended", startedAt: iso(-4 * 864e5), endedAt: iso(-4 * 864e5 + 40 * 60e3),
    durationMin: 40, participantsCount: 3,
  },
  {
    id: "m_5", title: "Marketing Standup", hostId: "u_3", hostName: "Jordan Lee",
    status: "ended", startedAt: iso(-6 * 864e5), endedAt: iso(-6 * 864e5 + 25 * 60e3),
    durationMin: 25, participantsCount: 8,
  },
];

const seedParticipants: Participant[] = [
  { id: "p_1", name: "Alex Rivera", isHost: true, isMuted: false, isCameraOn: true, isSpeaking: true, connection: "excellent", joinedAt: iso(-15 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=alex" },
  { id: "p_2", name: "Priya Shah", isMuted: false, isCameraOn: true, connection: "excellent", joinedAt: iso(-14 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=priya" },
  { id: "p_3", name: "Jordan Lee", isMuted: true, isCameraOn: true, connection: "good", joinedAt: iso(-12 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=jordan" },
  { id: "p_4", name: "Sam Okafor", isMuted: true, isCameraOn: false, handRaised: true, connection: "good", joinedAt: iso(-10 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=sam" },
  { id: "p_5", name: "Mika Chen", isMuted: false, isCameraOn: true, connection: "poor", joinedAt: iso(-8 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=mika" },
  { id: "p_6", name: "Rowan Patel", isMuted: true, isCameraOn: true, connection: "excellent", joinedAt: iso(-6 * 60e3), avatar: "https://api.dicebear.com/9.x/glass/svg?seed=rowan" },
];

const seedMessages: ChatMessage[] = [
  { id: "c_1", meetingId: "m_1", senderId: "system", senderName: "Meetly", content: "Meeting started", createdAt: iso(-15 * 60e3), system: true },
  { id: "c_2", meetingId: "m_1", senderId: "p_2", senderName: "Priya Shah", content: "Morning everyone 👋", createdAt: iso(-14 * 60e3) },
  { id: "c_3", meetingId: "m_1", senderId: "p_3", senderName: "Jordan Lee", content: "Sharing the deck in a sec", createdAt: iso(-12 * 60e3) },
  { id: "c_4", meetingId: "m_1", senderId: "p_5", senderName: "Mika Chen", content: "Audio dropped for a moment — back now.", createdAt: iso(-9 * 60e3) },
];

export const meetingService = {
  async list() { await delay(); return seedMeetings; },
  async recent() { await delay(); return seedMeetings.filter((m) => m.status === "ended"); },
  async upcoming() { await delay(); return seedMeetings.filter((m) => m.status === "scheduled"); },
  async get(id: string) {
    await delay(300);
    const m = seedMeetings.find((x) => x.id === id);
    if (!m) throw new Error("Meeting not found");
    return m;
  },
  async create(input: Partial<Meeting>) {
    await delay();
    const id = `m_${uid()}`;
    return { id, code: meetingCode(), ...input } as Meeting & { code: string };
  },
  async validateCode(code: string) {
    await delay(500);
    if (!code || code.length < 3) throw new Error("Invalid meeting code");
    return { ok: true, meetingId: "m_1" };
  },
  async participants(_id: string) { await delay(300); return seedParticipants; },
  async messages(_id: string) { await delay(300); return seedMessages; },

  /** Generate an .ics calendar file blob */
  generateCalendarEvent(meeting: Meeting & { code?: string }): Blob {
    const start = meeting.scheduledAt
      ? new Date(meeting.scheduledAt)
      : new Date();
    const end = new Date(start.getTime() + 60 * 60e3); // 1 hour default
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Meetly//EN",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${meeting.title}`,
      `DESCRIPTION:Join at meetly.app/join/${meeting.code || meeting.id}`,
      `URL:https://meetly.app/meetings/lobby/${meeting.id}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return new Blob([ics], { type: "text/calendar;charset=utf-8" });
  },

  /** Generate a Google Calendar event URL */
  generateGoogleCalendarUrl(meeting: Meeting & { code?: string }): string {
    const start = meeting.scheduledAt
      ? new Date(meeting.scheduledAt)
      : new Date();
    const end = new Date(start.getTime() + 60 * 60e3);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: meeting.title,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Join at meetly.app/join/${meeting.code || meeting.id}`,
      location: `https://meetly.app/meetings/lobby/${meeting.id}`,
    });
    return `https://calendar.google.com/calendar/r/eventedit?${params}`;
  },

  /** Get post-meeting summary mock details */
  async summary(id: string) {
    await delay(500);
    const meeting = seedMeetings.find((m) => m.id === id) || seedMeetings[0];
    return {
      meetingId: id,
      title: meeting.title,
      hostName: meeting.hostName,
      date: meeting.scheduledAt || new Date().toISOString(),
      durationMin: 42,
      attendees: seedParticipants,
      recordingUrl: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/mock-meeting-rec.mp4",
      actionItems: [
        "Alex to align with design team on meeting room layout constraints.",
        "Priya to send updated visual tokens for dark mode.",
        "Jordan to schedule client follow-up session by Friday.",
      ],
      transcript: [
        { time: "00:05", sender: "Alex Rivera", text: "Welcome everyone to our sync today." },
        { time: "01:22", sender: "Priya Shah", text: "I have shared the design links in the meeting chat panel." },
        { time: "05:40", sender: "Jordan Lee", text: "I think we need to test this on mobile layout as well." },
        { time: "12:15", sender: "Sam Okafor", text: "Is the recording started? Yes, looks like it's active." },
        { time: "24:32", sender: "Mika Chen", text: "Awesome work! Let's get these changes rolled out by EOD." },
      ]
    };
  }
};
