import type { User } from "@/types";
import { delay, uid } from "./_mock";
import { useAuthStore } from "@/store/auth.store";
import env from "@/utils/environment";
import axios from "axios"
import { RegisterPost } from "@/types/auth";
import { toast } from "sonner";
import { useMeetingStore } from "@/store/meeting.store";




const API_END_POINT = `${env.BASE_URL}/api/v1/auth`
axios.defaults.withCredentials = true

export const authService = {
  async login(email: string, _password: string) {
    try {

      const response = await axios.post(`${API_END_POINT}/login`, { email, password: _password },
        {
          headers: {
            "Content-Type": 'application/json',
          }
        }
      )
      console.log(response);

      if (response.data.success) {
        console.log(response.data.message);
        toast.success(response.data.message);

      }

      return response

    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },

  async register(data: RegisterPost) {
    console.log(data);
    try {

      const response = await axios.post(`${API_END_POINT}/register`, data, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      console.log(response);

      if (response.data.success) {
        // console.log(response.data.message);
        toast.success(response.data.message);

      }

    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }


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
    const state=useMeetingStore.getState();
    try {

      const response = await axios.get(`${API_END_POINT}/logout`)
      console.log(response);

      if (response.data.success) {
        // console.log(response.data.message);
        state.clearCurrentMeeting();
        state.setMeetings([]);
        toast.success(response.data.message);

      }

    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }

  },
};
