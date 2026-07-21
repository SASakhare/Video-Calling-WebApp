import { Socket } from "socket.io-client";
import { CLIENT_EVENTS, SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";
import TransportManager from "@/webrtc/transport/TransportManager";
import ProducerManager from "@/webrtc/producer/ProducerManager";
import LocalMediaManager from "@/webrtc/media/LocalMediaManager";
import MediaManager from "@/webrtc/core/MediaManager";
import { useAuthStore } from "@/store/auth.store";
import ConsumerManager from "@/webrtc/consumer/ConsumerManager";

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


            socket.emit(CLIENT_EVENTS.MEDIA_PRODUCING, {
                direction: "send"
            })



        } else if (data.direction == 'recv') {

            TransportManager.createRecvTransport({
                id: data.id,
                iceParameters: data.iceParameters,
                iceCandidates: data.iceCandidates,
                dtlsParameters: data.dtlsParameters,
            });

        }


    })

    socket.on(SERVER_EVENTS.NEW_PRODUCER, async (data) => {

        console.log("New Producer", data);

    })

    socket.on(SERVER_EVENTS.MEETING_SYNC, async (data) => {

        console.log("Meeting Sync :", data);

        // const state = useMeetingStore.getState();

        // state.setMeetingSync(data)
        useMeetingStore.getState().setMeetingParticipants(data.participants);

        //* * here we make the event file for all participant producer consume except myself.

        console.log("Meeting Sync End-1");

        console.log(TransportManager.getRecvTransport());

        console.log("Meeting Sync End-2");


        // for (const participant of data.participants) {

        //     console.log("Before Loop ");

        //     if (participant.userId != useAuthStore.getState().user.userId) {

        //         console.log(participant);
        //         console.log("emitting the ");
        //         // socket.emit(CLIENT_EVENTS.MEDIA_CONSUME, {
        //         //     producerId: participant.producer[0].producerId,
        //         //     rtpCapabilities: MediaManager.getDevice().rtpCapabilities
        //         // })

        //         // console.log(participant.producers);

        //         for (const producer of participant.producers) {
        //             console.log("producerId :");

        //             console.log(producer.producerId);


        //             console.log("rtpCapabilities :");
        //             console.log(MediaManager.getDevice().rtpCapabilities);


        //             socket.emit(CLIENT_EVENTS.MEDIA_CONSUME, {
        //                 producerId: producer.producerId,
        //                 rtpCapabilities: MediaManager.getDevice().rtpCapabilities
        //             },
        //                 (response) => {
        //                     console.log(response);
        //                 }
        //             )

        //         }


        //     }
        //     console.log("After Loop ");
        // }

        // ConsumerManager.

        console.log("Meeting Consuming Started");
        
        await ConsumerManager.consumeMeeting(data.participants);
        
        console.log("Meeting Consuming Ended");
    })



}





































