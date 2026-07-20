import { Socket } from "socket.io-client";
import { CLIENT_EVENTS, SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";
import TransportManager from "@/webrtc/transport/TransportManager";
import ProducerManager from "@/webrtc/producer/ProducerManager";
import LocalMediaManager from "@/webrtc/media/LocalMediaManager";


export const registerWebRTCHandlers = async (socket: Socket) => {

    socket.on(SERVER_EVENTS.MEDIA_CREATED_TRANSPORT, async (data) => {

        console.log("============================== MEDIA CREATED TRANSPORT ======================================");


        const track = LocalMediaManager.getVideoTrack();

        console.log(track);
        console.log(track?.readyState);
        console.log(track?.enabled);

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

        } else if (data.direction == 'recv') {
            TransportManager.createRecvTransport({
                id: data.id,
                iceParameters: data.iceParameters,
                iceCandidates: data.iceCandidates,
                dtlsParameters: data.dtlsParameters,
            });

        }

        socket.emit(CLIENT_EVENTS.MEDIA_PRODUCING, {
            direction: "send"
        })

    })

    socket.on(SERVER_EVENTS.NEW_PRODUCER, async (data) => {

        console.log("New Producer", data);

    })

    socket.on(SERVER_EVENTS.MEETING_SYNC, async (data) => {

        console.log("Meeting Sync :", data);

        // const state = useMeetingStore.getState();

        // state.setMeetingSync(data)
        useMeetingStore.getState().setMeetingParticipants(data.participants);

    })



}





































