import { MOCK_DELAY } from "@/constants";

export const delay = (ms = MOCK_DELAY) => new Promise((r) => setTimeout(r, ms));

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const meetingCode = () => {
  const seg = () => Math.random().toString(36).slice(2, 6);
  return `${seg()}-${seg()}-${seg()}`;
};
