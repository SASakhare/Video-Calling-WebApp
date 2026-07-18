import RoomService from "./RoomService.js";
import { mediaConfig } from "../config/mediasoup.config.js";


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


        if (!participant) {

            throw new Error(
                "Participant not found."
            );

        }



        const room =
            RoomService.getRoomByParticipant(
                participantId
            );


        if (!room) {

            throw new Error(
                "Room not found."
            );

        }



        const router =
            room.getRouter();



        const transport =
            await router.createWebRtcTransport({

                ...mediaConfig.webRtcTransport

            });



        // IMPORTANT
        // save transport with type

        participant.addTransport(
            direction,
            transport
        );



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


}


export default new MediaService();