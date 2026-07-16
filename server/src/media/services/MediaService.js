import RoomService from "./RoomService.js";
import { mediaConfig } from "../config/mediasoup.config.js";

class MediaService {

    // =====================================================
    // Create WebRTC Transport
    // =====================================================

    async createWebRtcTransport(participantId) {

        // Find participant

        const participant =
            RoomService.getParticipant(participantId);

        if (!participant) {

            throw new Error("Participant not found.");

        }

        // Find room

        const room =
            RoomService.getRoomByParticipant(participantId);

        if (!room) {

            throw new Error("Room not found.");

        }

        // Get Router

        const router = room.getRouter();

        // Create Transport

        const transport =
            await router.createWebRtcTransport({

                ...mediaConfig.webRtcTransport

            });

        // Save transport

        participant.addTransport(transport);

        console.log(
            `✅ Transport Created : ${transport.id}`
        );

        return {

            id: transport.id,

            iceParameters:
                transport.iceParameters,

            iceCandidates:
                transport.iceCandidates,

            dtlsParameters:
                transport.dtlsParameters,

        };

    }

}

export default new MediaService();