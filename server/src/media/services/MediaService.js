import RoomService from "./RoomService.js";
import { mediaConfig } from "../config/mediasoup.config.js";
import { getParticipantByParticipantIdDB } from "../../services/participant.database.service.js"
import { SERVER_EVENTS } from "../../socket/constants/socket.events.js";


class MediaService {


    // =====================================================
    // Create WebRTC Transport
    // =====================================================

    async createWebRtcTransport(
        participantId,
        direction
    ) {


        const participant =
            RoomService.getParticipant(
                participantId
            );

        console.log("========================= Media Service =======================");
        console.log(participant);



        if (!participant) {

            throw new Error(
                "Participant not found."
            );

        }



        const room =
            RoomService.getRoomByParticipant(
                participantId
            );

        console.log("room :", room);



        if (!room) {

            throw new Error(
                "Room not found."
            );

        }



        const router =
            room.getRouter();


        console.log("Router :", router);


        const transport =
            await router.createWebRtcTransport({

                ...mediaConfig.webRtcTransport

            });


        console.log('transport :', transport);


        // IMPORTANT
        // save transport with type

        participant.addTransport(
            direction,
            transport
        );

        console.log("participant added");


        const participantData = getParticipantByParticipantIdDB(participantId)

        console.log("participant added");
        // const roomId = `${participantData.hostId}:${participantData.meetingId}`


        // participant.socket.to(roomId).emit(SERVER_EVENTS.NEW_PRODUCER, {
        //     producerId,
        //     participant,
        //     kind,
        //     appData,
        // })

        console.log(
            `✅ ${direction} Transport Created : ${transport.id}`
        );



        return {

            id: transport.id,

            iceParameters:
                transport.iceParameters,

            iceCandidates:
                transport.iceCandidates,

            dtlsParameters:
                transport.dtlsParameters

        };


    }

    async connectTransport(
        participantId,
        direction,
        dtlsParameters
    ) {

        const participant = RoomService.getParticipant(participantId);

        if (!participant) {
            throw new Error(
                "Participant not found."
            )
        }


        const transport = participant.getTransportByType(direction)


        if (!transport) {
            throw new Error(
                `${direction} transport not found.`
            )
        }

        await transport.connect({
            dtlsParameters,
        })

        console.log(`✅ ${direction} Transport Connected`);


    }

    async createProducer(
        participantId,
        kind,
        rtpParameters,
        appData
    ) {

        const participant =
            RoomService.getParticipant(
                participantId
            );

        if (!participant) {

            throw new Error(
                "Participant not found."
            );

        }

        const transport =
            participant.getTransportByType(
                "send"
            );

        if (!transport) {

            throw new Error(
                "Send transport not found."
            );

        }

        const producer =
            await transport.produce({

                kind,

                rtpParameters,

                appData,

            });

        participant.addProducer(
            producer
        );



        console.log(
            `✅ Producer Created : ${producer.id}`
        );

        producer.on(
            "transportclose",
            () => {

                participant.removeProducer(
                    producer.id
                );

            }
        );

        producer.on(
            "close",
            () => {

                participant.removeProducer(
                    producer.id
                );

            }
        );

        return producer;

    }

    async createConsumer(
        participantId,
        producerId,
        rtpCapabilities
    ) {


        const room = RoomService.getRoomByParticipant(participantId);

        if (!room) {
            throw new Error("Room not found");
        }

        const participant = room.getParticipant(participantId);


        if (!participant) {
            throw new Error("Participant not found");
        }

        const recvTransport = participant.getTransportByType("recv");


        if (!recvTransport) {
            throw new Error("Receive transport not found");
        }

        const router = room.getRouter();

        const canConsume = router.canConsume({
            producerId,
            rtpCapabilities,
        })

        if (!canConsume) {
            throw new Error(
                "Client cannot consume this producer"
            )
        }

        const consumer = await recvTransport.consume({
            producerId,
            rtpCapabilities,
            paused: false,
        });



        consumer.on(
            "transportclose",
            () => {

                participant.removeConsumer(
                    consumer.id
                );

            }
        );

        consumer.on(
            "producerclose",
            () => {

                participant.removeConsumer(
                    consumer.id
                );

            }
        );

        consumer.on(
            "close",
            () => {

                participant.removeConsumer(
                    consumer.id
                );

            }
        );

        participant.addConsumer(consumer);


        return {
            id: consumer.id,
            producerId: consumer.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            producerPaused: consumer.producerPaused,
            appData: consumer.appData
        };



    }


}


export default new MediaService();