import { v4 as uuid } from "uuid"
import { hashPassword } from "../utils/password.js";
import { createMeetingLink } from "../utils/meeting.utils.js";
import { createMeetingDB } from "../services/meeting.database.service.js";
import { nanoid } from "nanoid";

export const createMeeting = async (req, res) => {

    try {
        const data = req.body;
        console.log(data);
        const passcode = data.passcode ? data.passcode : nanoid(5);
        const hashPasscode = await hashPassword(passcode)
        const meetingId = uuid();
        const meetingLink = createMeetingLink(meetingId);
        const meetingData = {
            meetingId: meetingId,
            hostId: req.userId,
            title: data.title,
            description: data.description,
            type_: data.type,
            status: 'CREATED',
            meetingPassword: hashPasscode,
            waitingRoomEnabled: data.waitingRoom,
            participantLimit: 100,
            scheduledStartTime: data.type == 'INSTANT' ? null : data.scheduledStartTime,
            scheduledEndTime: data.type == "INSTANT" ? null : data.scheduledEndTime,
            meetingLink: meetingLink,
            actualStartTime: null,
            actualEndTime: null,
        }

        await createMeetingDB(meetingData);

        res.status(200).json({
            success: true,
            message: "Meeting Created Successfully",
            meeting: {
                ...meetingData, meetingPassword: passcode,
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}























