
import MediaService from "../../media/services/MediaService.js"
import { CLIENT_EVENTS, SERVER_EVENTS } from "../constants/socket.events.js"
import RoomService from "../../media/services/RoomService.js"



export function registerMediaEvents(io, socket) {

    socket.on(CLIENT_EVENTS.MEDIA_CREATE_TRANSPORT,
        async ({ direction }) => {

            try {

                const participant = RoomService.getParticipantBySocket(socket.id);

                if (!participant) {
                    throw new Error("Participant Not Found")
                }

                const transport = await MediaService.createWebRtcTransport(participant.participantId, direction);


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

    socket.on(
        CLIENT_EVENTS.MEDIA_PRODUCE,

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











