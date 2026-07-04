import type { Notification } from "@/types";
import { delay } from "./_mock";

const seed: Notification[] = [
  { id: "n1", type: "invite", title: "Meeting invitation", description: "Priya invited you to “Design Sync — Meeting Room v2”", createdAt: new Date(Date.now() - 15 * 60e3).toISOString(), read: false, href: "/meetings/lobby/m_2" },
  { id: "n2", type: "reminder", title: "Starts in 15 minutes", description: "Q3 Product Review starts soon", createdAt: new Date(Date.now() - 30 * 60e3).toISOString(), read: false, href: "/meetings/lobby/m_1" },
  { id: "n3", type: "system", title: "Recording ready", description: "Your recording for Weekly All-Hands is available", createdAt: new Date(Date.now() - 2 * 3600e3).toISOString(), read: true },
  { id: "n4", type: "meeting", title: "Sam Okafor joined", description: "Sam joined “Customer Interview — Northwind”", createdAt: new Date(Date.now() - 26 * 3600e3).toISOString(), read: true },
];

export const notificationService = {
  async list() { await delay(300); return seed; },
};
