import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type LayoutMode = "grid" | "speaker" | "presentation";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  chatOpen: boolean;
  participantsOpen: boolean;
  layoutMode: LayoutMode;
  setTheme: (t: Theme) => void;
  toggleSidebar: () => void;
  setChatOpen: (v: boolean) => void;
  setParticipantsOpen: (v: boolean) => void;
  setLayoutMode: (m: LayoutMode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarCollapsed: false,
      chatOpen: false,
      participantsOpen: false,
      layoutMode: "grid",
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      setParticipantsOpen: (participantsOpen) => set({ participantsOpen }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),
    }),
    { name: "meetly.ui" }
  )
);
