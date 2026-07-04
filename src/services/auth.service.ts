import type { User } from "@/types";
import { delay, uid } from "./_mock";

const MOCK_USER: User = {
  id: "u_1",
  name: "Alex Rivera",
  email: "alex@meetly.app",
  role: "host",
  title: "Product Lead",
  bio: "Building beautiful software for distributed teams.",
  avatar: "https://api.dicebear.com/9.x/glass/svg?seed=alex&backgroundType=gradientLinear",
  createdAt: new Date(Date.now() - 90 * 864e5).toISOString(),
};

export const authService = {
  async login(email: string, _password: string) {
    await delay();
    if (!email.includes("@")) throw new Error("Invalid credentials");
    return { user: { ...MOCK_USER, email }, token: uid() };
  },
  async register(name: string, email: string, _password: string) {
    await delay();
    return { user: { ...MOCK_USER, id: uid(), name, email }, token: uid() };
  },
  async forgotPassword(email: string) {
    await delay();
    if (!email.includes("@")) throw new Error("Enter a valid email");
    return { ok: true };
  },
  async resetPassword(_token: string, _password: string) {
    await delay();
    return { ok: true };
  },
  async verifyEmail(_code: string) {
    await delay();
    return { ok: true };
  },
  async logout() {
    await delay(200);
    return { ok: true };
  },
};
