import { create } from "zustand";
import type { Notification } from "@/types";
import { uid } from "@/services/_mock";

interface NotifState {
  items: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  seed: (items: Notification[]) => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotifState>((set) => ({
  items: [],
  markRead: (id) =>
    set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  push: (n) =>
    set((s) => ({
      items: [{ ...n, id: uid(), createdAt: new Date().toISOString(), read: false }, ...s.items],
    })),
  seed: (items) => set({ items }),
  remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
}));
