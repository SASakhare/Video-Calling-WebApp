import type { Meeting, Participant, ChatMessage } from "@/types";
import { delay } from "./_mock";
import env from "@/utils/environment";
import axios from "axios";
import { toast } from "sonner";
import { useMeetingStore } from "@/store/meeting.store";


const API_END_POINT = `${env.BASE_URL}/api/v1/meetings`
axios.defaults.withCredentials = true


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


  async list() {
    try {
      const state = useMeetingStore.getState();

      if (state.meetings.length != 0) {
        return state.meetings;
      }

      const response = await axios.get(`${API_END_POINT}/`);
      console.log(response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        state.setMeetings(response.data.meetings)

      }

      return response.data.meetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },

  async recent() {

    const state = useMeetingStore.getState();

    try {
      const meetings = state.meetings;

      const recentMeetings = meetings.filter((m) => m.status == 'ENDED')
      return recentMeetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },

  async upcoming() {
    const state = useMeetingStore.getState();

    try {
      const meetings = state.meetings;
      const now = new Date();
      const upcomingMeetings = meetings.filter(
        (meeting) =>
          meeting.status === "CREATED" &&
          meeting.scheduledStartTime &&
          new Date(meeting.scheduledStartTime) > now
      );
      return upcomingMeetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },
  async waiting() {
    const state = useMeetingStore.getState();

    try {
      const meetings = state.meetings;

      const filteredMeetings = meetings.filter((m) => m.status == 'WAITING')
      return filteredMeetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },
  async live() {
    const state = useMeetingStore.getState();

    try {
      const meetings = state.meetings;

      const filteredMeetings = meetings.filter((m) => m.status == 'LIVE')
      return filteredMeetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },
  async cancelled() {
    const state = useMeetingStore.getState();

    try {
      const meetings = state.meetings;

      const filteredMeetings = meetings.filter((m) => m.status == 'CANCELLED')
      return filteredMeetings;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },

  async cancel(meetingId: string) {
    const state = useMeetingStore.getState();

    try {

      const response = await axios.delete(`${API_END_POINT}/${meetingId}/cancel`);
      if (response.data.success) {
        console.log(response);
        state.updateMeeting(response.data.meeting);
        toast.success(response.data.message);
      }
      return;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }
  },
  async update(payload: { meetingId: string } & Partial<Meeting>) {
    const state = useMeetingStore.getState();

    try {
      const { meetingId, ...data } = payload;
      console.log(data);

      const response = await axios.patch(
        `${API_END_POINT}/${meetingId}`,
        data
      );

      if (response.data.success) {
        console.log(response);
        state.updateMeeting(response.data.meeting);
        toast.success(response.data.message);
      }

      return response.data.meeting as Meeting;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }



  },
  getMeetingDuration(
    actualStartTime?: string,
    actualEndTime?: string
  ): string {
    if (!actualStartTime || !actualEndTime) {
      return "--";
    }

    const start = new Date(actualStartTime);
    const end = new Date(actualEndTime);

    const diff = end.getTime() - start.getTime();

    const totalMinutes = Math.floor(diff / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  },

  async get(id: string) {
    const state = useMeetingStore.getState();
    console.log('Inside get function ');
    console.log("id :", id);


    const meetings = state.meetings;

    const meeting = meetings.filter((m) => m.meetingId == id);

    if (meeting) {
      console.log(meeting[0]);
      return meeting[0];

    }
    try {
      const response = await axios.get(`${API_END_POINT}/${id}`);

      if (response.data.success) {
        console.log(response);
      }

      return response.data.meeting;

    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message)

    }

    return;
  },

  async create(input: Partial<Meeting>) {
    // * we have create meeting here and then send the url

    try {
      console.log(input);

      // const data={...input,}

      const response = await axios.post(`${API_END_POINT}/`, input, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
      }

      return response;

    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);

    }



  },
  async validateCode(code: string) {

    try {
      console.log(code);

      const response = await axios.get(`${API_END_POINT}/${code}`);

      if (response.data.success) {
        console.log(response.data);

        toast.success("Meeting found — joining lobby")
      }
      return response.data.meeting;
    } catch (error) {

      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }

  },
  async participants(_id: string) { await delay(300); return seedParticipants; },
  async messages(_id: string) { await delay(300); return seedMessages; },

  /** Generate an .ics calendar file blob */
  generateCalendarEvent(meeting: Meeting & { code?: string }): Blob {
    const start = meeting.scheduledStartTime
      ? new Date(meeting.scheduledStartTime)
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
      `DESCRIPTION:Join at meetly.app/join/${meeting.code || meeting.meetingId}`,
      `URL:https://meetly.app/meetings/lobby/${meeting.meetingId}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return new Blob([ics], { type: "text/calendar;charset=utf-8" });
  },

  /** Generate a Google Calendar event URL */
  generateGoogleCalendarUrl(meeting: Meeting & { code?: string }): string {
    const start = meeting.scheduledStartTime
      ? new Date(meeting.scheduledStartTime)
      : new Date();
    const end = new Date(start.getTime() + 60 * 60e3);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: meeting.title,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Join at meetly.app/join/${meeting.code || meeting.meetingId}`,
      location: `https://meetly.app/meetings/lobby/${meeting.meetingId}`,
    });
    return `https://calendar.google.com/calendar/r/eventedit?${params}`;
  },

  /** Get post-meeting summary mock details */
  async summary(id: string) {
    await delay(500);
    const meeting = seedMeetings.find((m) => m.meetingId === id) || seedMeetings[0];
    return {
      meetingId: id,
      title: meeting.title,
      hostName: meeting.hostName,
      date: meeting.scheduledStartTime || new Date().toISOString(),
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
