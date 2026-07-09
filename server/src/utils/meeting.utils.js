import { v4 as uuid } from "uuid"
import { env } from "../config/env.js"


export const createMeetingLink = (meetingId) => {

    const url = `${env.CLIENT_URL}/meeting/join?meetingId=${meetingId}`
    return url;
}










