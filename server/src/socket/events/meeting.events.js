/*

Only meeting lifecycle events.

    meeting:start

    meeting:join

    meeting:leave

    meeting:end

*/

import { getMeetingDB, getMeetingByMeetingIdDB } from "../../services/meeting.database.service.js";
import { createParticipantDB, getParticipantsDB, updateParticipantDB, getParticipantDB } from "../../services/participant.database.service.js";
import { CustomError } from "../../utils/customeError.js";
import { CLIENT_EVENTS, SERVER_EVENTS } from "../constants/socket.events.js";
import { v4 as uuid } from "uuid"
import RoomService from "../../media/services/RoomService.js"
import MediaParticipant from "../../media/models/MediaParticipant.js";

export const registerMeetingEvents = (io, socket) => {

    // * Meeting Start 

    socket.on(CLIENT_EVENTS.MEETING_START, async (payload) => {

        console.log("Meeting Start");
        try {

            // const 
            console.log(payload);
            const { meetingId, passcode } = payload;
            // console.log(payload);
            console.log(socket.data.userId);

            const userId = socket.data.userId;

            const meeting = await getMeetingDB(userId, meetingId);
            // console.log(meeting);

            if (meeting.hostId.toString() !== userId) {

                // throw new CustomError("Only host can start meeting", 503);
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Only host can start meeting"
                })
                return;
            }
            console.log("All Rooms : \n");


            console.log(io.sockets.adapter.rooms);


            // if (meeting.status !== 'CREATED') {

            //     socket.emit(SERVER_EVENTS.ERROR, {
            //         message: "Meeting already started"
            //     })
            //     return;
            // }

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

            let participant = await getParticipantDB(userId, meetingId);
            if (participant) {
                participant = await updateParticipantDB(participant.participantId, {
                    status: 'JOINED',
                    joinedAt: new Date(),
                })
            } else {

                participant = await createParticipantDB(userId, meetingId, participantData);
            }


            // * creating the Socket Room :

            const roomId = `${meeting.hostId}:${meeting.meetingId}`
            console.log("Joining Room :", roomId);

            await socket.join(roomId);
            console.log(io.sockets.adapter.rooms);

            console.log("Joined Room");

            socket.data.roomId = roomId;
            socket.data.meetingId = meetingId;
            socket.data.hostId = meeting.hostId;
            socket.data.participantId = participant.participantId

            console.log('Host Started Meeting :');
            console.log("Room Id :-", roomId);


            // * ------------------ Media Room Meeting START ---------------------

            const room = await RoomService.createRoom(meetingId);

            // room.addParticipant(mediaParticipant);

            RoomService.joinParticipant({
                meetingId,
                participantId:participant.participantId,
                userId,
                socket,
            })

            const routerRtpCapabilities = room.router.rtpCapabilities;


            // * ------------------ Media Room Meeting END -----------------------


            socket.emit(SERVER_EVENTS.MEETING_STARTED, {
                meetingId,
                roomId,
                participant,
                routerRtpCapabilities,
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
        try {

            // const 
            console.log(payload);
            const { meetingId, passcode } = payload;
            // console.log(payload);
            console.log(socket.data.userId);
            const userId = socket.data.userId;

            const meeting = await getMeetingByMeetingIdDB(meetingId);

            const roomId = `${meeting.hostId}:${meeting.meetingId}`

            console.log(meeting);

            // * live room validation :
            const room = io.sockets.adapter.rooms.get(roomId);
            // console.log("room-:", room);
            console.log(io.sockets.adapter.rooms);
            console.log(io.sockets.adapter.rooms.get(roomId));



            if (!room) {
                socket.emit(
                    SERVER_EVENTS.ERROR, {
                    message: "Live Meeting not found"
                }
                )
                return;
            }

            // * passcode validation 
            if (meeting.passcode) {
                if (meeting.passcode !== passcode) {
                    socket.emit(SERVER_EVENTS.ERROR, {
                        message: "link or passcode invalid"
                    })
                    return;
                }
            }

            if (meeting.status == 'ENDED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Ended by host"
                })
                return
            }

            if (meeting.status == 'CANCELLED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Cancel by Host"
                })
                return
            }

            if (meeting.status == 'CREATED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Not Started"
                })
                return
            }



            // * create participant :

            const participantData = {
                participantId: uuid(),
                meetingId: meetingId,
                userId,
                hostId: meeting.hostId,
                status: 'JOINED',
                role: "PARTICIPANT",
                joinedAt: new Date(),

            }

            let participant = await getParticipantDB(meeting.hostId, meetingId);
            console.log(participant);



            // let participant;

            if (participant) {
                console.log("user already exist");
                console.log(`participantId :${participant.participantId}`);

                if (meeting.waitingRoomEnabled) {

                    participantData.status = "WAITING"
                    participant = await updateParticipantDB(participant.participantId, {
                        status: 'JOINED',
                        joinedAt: new Date(),
                    })

                    socket.emit(SERVER_EVENTS.PARTICIPANT_WAITING, {
                        message: "Wait Host Allow in Meeting"
                    })

                    const hostRoom =
                        `${meeting.hostId}:${meeting.meetingId}`;

                    io.to(hostRoom).emit(

                        SERVER_EVENTS.PARTICIPANT_WAITING,

                        participant

                    );

                    return;
                }

                participant = await updateParticipantDB(participant.participantId, {
                    status: 'JOINED',
                    joinedAt: new Date(),
                })

            } else {
                if (meeting.waitingRoomEnabled) {
                    participantData.status = "WAITING"
                    participant = await createParticipantDB(userId, meetingId, participantData);

                    socket.emit(SERVER_EVENTS.PARTICIPANT_WAITING, {
                        message: "Wait Host Allow in Meeting",
                    })

                    const hostRoom =
                        `${meeting.hostId}:${meeting.meetingId}`;

                    io.to(hostRoom).emit(

                        SERVER_EVENTS.PARTICIPANT_WAITING,

                        participant

                    );

                    return;
                }
                participant = await createParticipantDB(userId, meetingId, participantData);
            }

            console.log('Participant :\n ');
            console.log(participant);



            // * creating the Socket Room :

            console.log("Joining Room :", roomId);

            await socket.join(roomId);

            console.log(io.sockets.adapter.rooms);

            console.log("Joined Room");

            socket.data.roomId = roomId;
            socket.data.meetingId = meetingId;
            socket.data.hostId = meeting.hostId;

            // socket.emit(SERVER_EVENTS.PARTICIPANT_JOINED, {
            //     meetingId,
            //     roomId,
            // })
            console.log(`${userId}-joined-room-${roomId}`);

            io.to(roomId).emit(
                SERVER_EVENTS.PARTICIPANT_JOINED,
                {
                    message: "participant Joined",
                    participant
                }
            )

        } catch (error) {
            console.error("ERROR - Meeting Join Failure:", error.message);

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


    // * Meeting Leave 

    socket.on(CLIENT_EVENTS.MEETING_LEAVE, async (payload) => {

        console.log("Meeting Leave");
        try {

            // const 
            console.log(payload);
            const { meetingId, passcode } = payload;
            // console.log(payload);
            console.log(socket.data.userId);
            const userId = socket.data.userId;

            const meeting = await getMeetingByMeetingIdDB(meetingId);

            const roomId = `${meeting.hostId}:${meeting.meetingId}`

            console.log(meeting);

            // * live room validation :
            const room = io.sockets.adapter.rooms.get(roomId);
            // console.log("room-:", room);
            console.log(io.sockets.adapter.rooms);
            console.log(io.sockets.adapter.rooms.get(roomId));



            if (!room) {
                socket.emit(
                    SERVER_EVENTS.ERROR, {
                    message: "Live Meeting not found"
                }
                )
                return;
            }

            // * passcode validation 
            if (meeting.passcode) {
                if (meeting.passcode !== passcode) {
                    socket.emit(SERVER_EVENTS.ERROR, {
                        message: "link or passcode invalid"
                    })
                    return;
                }
            }

            if (meeting.status == 'ENDED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Ended by host"
                })
                return
            }

            if (meeting.status == 'CANCELLED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Cancel by Host"
                })
                return
            }

            if (meeting.status == 'CREATED') {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Meeting Not Started"
                })
                return
            }

            // if (meeting.status == 'WAITING') {
            //     socket.emit(SERVER_EVENTS.ERROR, {
            //         message: "Wait Host Allow in Meeting"
            //     })
            //     return
            // }


            // * create participant :

            let participant = await getParticipantDB(meeting.hostId, meetingId);
            console.log(participant);

            // let participant;
            if (participant) {
                console.log("user  exist");


                participant = await updateParticipantDB(participant.participantId, {
                    status: 'LEFT',
                    joinedAt: new Date(),
                })
            } else {
                socket.emit(SERVER_EVENTS.ERROR, {
                    message: "Participant Not Found"
                })
                return
            }

            // * creating the Socket Room :

            console.log("leaving Room :", roomId);

            await socket.leave(roomId);

            console.log(io.sockets.adapter.rooms);

            console.log("Leaved Room");

            socket.data.roomId = roomId;
            socket.data.meetingId = meetingId;
            socket.data.hostId = meeting.hostId;

            // socket.emit(SERVER_EVENTS.PARTICIPANT_JOINED, {
            //     meetingId,
            //     roomId,
            // })
            console.log(`${userId}-leaved-room-${roomId}`);

            io.to(roomId).emit(
                SERVER_EVENTS.PARTICIPANT_LEFT,
                {
                    message: "participant Left",
                    participant
                }
            )

        } catch (error) {
            console.error("ERROR - Meeting Join Failure:", error.message);

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
    // * Meeting End

    socket.on(CLIENT_EVENTS.MEETING_END, async (payload) => {

        console.log("Meeting End");
        console.log(payload);

    })

}




