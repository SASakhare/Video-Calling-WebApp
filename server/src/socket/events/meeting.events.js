/*

Only meeting lifecycle events.

    meeting:start

    meeting:join

    meeting:leave

    meeting:end

*/

import { getMeetingDB } from "../../services/meeting.database.service.js";
import { createParticipantDB } from "../../services/participant.database.service.js";
import { CLIENT_EVENTS, SERVER_EVENTS } from "../constants/socket.events.js";
import { v4 as uuid } from "uuid"

export const registerMeetingEvents = (io, socket) => {

    // * Meeting Start 

    socket.on(CLIENT_EVENTS.MEETING_START, async (payload) => {

        try {

            console.log("Meeting Start");
            // const 
            console.log(payload);
            const { meetingId, passcode } = payload;
            // console.log(payload);
            console.log(socket.data.userId);
            const userId = socket.data.userId;
            const meeting = await getMeetingDB(userId, meetingId);
            console.log(meeting);

            if (meeting.hostId.toString() !== userId) {

                // throw new CustomError("Only host can start meeting", 503);
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Only host can start meeting"
                })
                return;
            }

            if (meeting.status !== 'CREATED') {

                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting already started"
                })
                return;
            }

            // * start Meeting :
            meeting.status = 'LIVE';

            meeting.actualStartTime = new Date()

            await meeting.save();

            // * create participant :

            const participantData = {
                participantId: uuid(),
                meetingId: meetingId,
                userId,
                hostId: meeting.hostId,
                status: 'JOINED',
                role: "HOST",
                joinedAt: new Date(),

            }


            const participant = await createParticipantDB(userId, meetingId, participantData);

            // * creating the Socket Room :

            const roomId = `${meeting.hostId}:${meeting.meetingId}`

            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.meetingId = roomId;
            socket.data.hostId = meeting.hostId;

            socket.emit(SERVER_EVENTS.MEETING_STARTED, {
                meetingId,
                roomId,
            })

        } catch (error) {
            console.error("ERROR - Meeting Start Failure:", error.message);

            if (error instanceof CustomError || error.statusCode) {
                // throw error;
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: error.message,
                })
                return;

            }
            // throw new CustomError("Error while Meeting Fetching", 503);
            socket.emit(SERVER_EVENTS.ERROR, {
                message: "Error while Meeting Fetching",
            })
            return;

        }
    })

    // * Meeting Join 

    socket.on(CLIENT_EVENTS.MEETING_JOIN, async (payload) => {

        console.log("Meeting Join");
        console.log(payload);

    })


    // * Meeting Leave 

    socket.on(CLIENT_EVENTS.MEETING_LEAVE, async (payload) => {

        console.log("Meeting Leave");
        console.log(payload);


    })
    // * Meeting End

    socket.on(CLIENT_EVENTS.MEETING_END, async (payload) => {

        console.log("Meeting End");
        console.log(payload);

    })

}




