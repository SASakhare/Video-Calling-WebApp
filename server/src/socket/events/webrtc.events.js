
import MediaService from "../../media/services/MediaService.js"
import { CLIENT_EVENTS, SERVER_EVENTS } from "../constants/socket.events.js"
import RoomService from "../../media/services/RoomService.js"
import { getParticipantByParticipantIdDB } from "../../services/participant.database.service.js"


export function registerMediaEvents(io, socket) {

    socket.on(CLIENT_EVENTS.MEDIA_CREATE_TRANSPORT,
        async ({ direction }) => {


            try {
                console.log("============================== MEDIA CREATE TRANSPORT ======================================");
                console.log(`=========================== direction : ${direction} ===============================`);

                const participant = RoomService.getParticipantBySocket(socket.id);
                console.log(participant);

                if (!participant) {
                    throw new Error("Participant Not Found")
                }


                const transport = await MediaService.createWebRtcTransport(participant.participantId, direction);


                console.log("==================================== MEDIA CREATED TRANSPORT ======================================");

                socket.emit(SERVER_EVENTS.MEDIA_CREATED_TRANSPORT, {
                    direction,
                    ...transport
                });

            } catch (error) {

                socket.emit(SERVER_EVENTS.MEDIA_ERROR, {
                    message: error.message,
                })
            }
        }
    )



    socket.on(CLIENT_EVENTS.MEDIA_PRODUCING,
        async ({ direction }) => {

            try {

                console.log("============================== MEDIA PRODUCING ======================================");

                const participant = RoomService.getParticipantBySocket(socket.id);

                if (!participant) {
                    throw new Error("Participant not found.");
                }

                // =====================================================
                // Notify everyone that this participant now has producers
                // =====================================================

                const roomId = `${participant.getHostId()}:${participant.getMeetingId()}`;

                socket.to(roomId).emit(
                    SERVER_EVENTS.PARTICIPANT_JOINED,
                    participant.toDTO()
                );

                // =====================================================
                // Meeting Sync
                // =====================================================

                const room = RoomService.getRoom(
                    participant.getMeetingId()
                );

                if (!room) {
                    throw new Error("Room not found.");
                }

                const participants = room
                    .getParticipants()
                    .map((participant) => participant.toDTO());

                socket.emit(
                    SERVER_EVENTS.MEETING_SYNC,
                    {
                        meetingId: room.getMeetingId(),
                        participants,
                    }
                );

            } catch (error) {


                console.error(error);

                socket.emit(
                    SERVER_EVENTS.MEDIA_ERROR,
                    {
                        message: error.message,
                    }
                );

            }

        }
    );


    socket.on(CLIENT_EVENTS.MEDIA_CONSUME,
        async ({
            producerId,
            rtpCapabilities
        },
            callback
        ) => {

            try {
                console.log("================================== MEDIA CONSUME =================================");

                const participant = RoomService.getParticipantBySocket(socket.id);

                if (!participant) {

                    throw new Error(
                        "Participant not found."
                    )
                }

                console.log("Creating the Consumer.");


                const consumer = await MediaService.createConsumer(
                    participant.getParticipantId(),
                    producerId,
                    rtpCapabilities,
                );

                console.log('consumer');
                console.log(consumer);

                consumer.participantId = socket.data.participantId;

                callback({
                    success: true,
                    consumer,
                })


            } catch (error) {

                console.error(error);

                callback({

                    success: false,

                    message: error.message,

                });

            }

        }
    );




    socket.on(CLIENT_EVENTS.MEDIA_CONNECT_TRANSPORT, async ({ direction, dtlsParameters }, callback) => {

        try {

            const participant = RoomService.getParticipantBySocket(socket.id);
            console.log(
                "Client DTLS:",
                dtlsParameters
            );
            if (!participant) {
                throw new Error(
                    "Participant not found."
                );
            }

            await MediaService.connectTransport(
                participant.getParticipantId(),
                direction,
                dtlsParameters,
            );


            callback({
                success: true
            })

        } catch (error) {
            console.error(error);

            callback({
                success: false,
                message: error.message,
            })

        }
    })



    socket.on(CLIENT_EVENTS.MEDIA_PRODUCE,

        async (
            {
                kind,
                rtpParameters,
                appData
            },
            callback
        ) => {

            try {

                const participant =
                    RoomService.getParticipantBySocket(
                        socket.id
                    );

                if (!participant) {

                    throw new Error(
                        "Participant not found."
                    );

                }

                const producer =
                    await MediaService.createProducer(

                        participant.getParticipantId(),

                        kind,

                        rtpParameters,

                        appData

                    );

                callback({

                    success: true,

                    producerId: producer.id,

                });

            }

            catch (error) {

                callback({

                    success: false,

                    message: error.message,

                });

            }

        }
    );


}











