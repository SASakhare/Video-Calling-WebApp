import { Socket } from "socket.io-client";
import { SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";
import TransportManager from "@/webrtc/transport/TransportManager";
import ProducerManager from "@/webrtc/producer/ProducerManager";
import LocalMediaManager from "@/webrtc/media/LocalMediaManager";


export const registerWebRTCHandlers =async (socket: Socket) => {

    socket.on(SERVER_EVENTS.MEDIA_CREATED_TRANSPORT,async  (data) => {

        if (data.direction == 'send') {
            TransportManager.createSendTransport({
                id: data.id,
                iceParameters: data.iceParameters,
                iceCandidates: data.iceCandidates,
                dtlsParameters: data.dtlsParameters,
            });

            await ProducerManager.produce(
                LocalMediaManager.getVideoTrack()!,
                {
                    mediaTag: "camera",
                }
            );

            await ProducerManager.produce(
                LocalMediaManager.getAudioTrack()!,
                {
                    mediaTag: "microphone",
                }
            );
        }
    })

}



































