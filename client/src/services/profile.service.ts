import type { User } from "@/types";
import { delay } from "./_mock";

export const profileService = {
  async update(patch: Partial<User>) {
    await delay();
    return { ok: true, patch };
  },
  async uploadAvatar(_file: File) {
    await delay(900);
    return { url: `https://api.dicebear.com/9.x/glass/svg?seed=${Math.random()}` };
  },
  async uploadCover(_file: File) {
    await delay(900);
    return { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600" };
  },
  async stats() {
    await delay(300);
    return {
      hosted: 47,
      joined: 213,
      minutes: 8420,
      recordings: 12,
    };
  },
  async activity() {
    await delay(300);
    return [
      { id: "a1", kind: "hosted", label: "Hosted Q2 Retro", at: new Date(Date.now() - 3600e3).toISOString() },
      { id: "a2", kind: "joined", label: "Joined Design Sync", at: new Date(Date.now() - 26 * 3600e3).toISOString() },
      { id: "a3", kind: "recorded", label: "Saved recording — All Hands", at: new Date(Date.now() - 2 * 864e5).toISOString() },
      { id: "a4", kind: "scheduled", label: "Scheduled Customer Call", at: new Date(Date.now() - 3 * 864e5).toISOString() },
    ];
  },
};
