import { Socket } from "socket.io-client";
import { CLIENT_EVENTS, SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";
import MediaManager from "@/webrtc/core/MediaManager";
import TransportManager from "@/webrtc/transport/TransportManager";
import LocalMediaManager from "@/webrtc/media/LocalMediaManager";



export const registerMeetingHandlers = (socket: Socket) => {

    // * ----------------- Meeting Event ----------------
    socket.on(
        SERVER_EVENTS.MEETING_STARTED, async (data) => {


            console.log('================================ Meeting Started ===================================');

            console.log(data);


            // * we make webRtc connection here : 

            await MediaManager.initialize(data.routerRtpCapabilities)
            TransportManager.initialize(socket);

            await LocalMediaManager.initialize();

            socket.emit(CLIENT_EVENTS.MEDIA_CREATE_TRANSPORT,{
                direction:"send",
            })

            // socket.emit(CLIENT_EVENTS.MEDIA_CREATE_TRANSPORT,{
            //     direction:"recv",
            // })

        }
    )
    socket.on(
        SERVER_EVENTS.MEETING_ENDED, (data) => {

            console.log('Meeting Ended');

            console.log(data);

        }
    )

    // socket.on(
    //     SERVER_EVENTS.
    // )

    // * ----------------- Meeting Error Event ----------------

    socket.on(
        SERVER_EVENTS.ERROR, (data) => {

            console.log('Meeting Error');

            console.log(data);

        }
    )


    // * ----------------- Meeting Join Event--------------

    socket.on(
        SERVER_EVENTS.WAITING_ROOM_UPDATED, (data) => {

            console.log('Meeting Waiting Room Update');

            console.log(data);

        }
    )
    socket.on(
        SERVER_EVENTS.JOIN_APPROVED, (data) => {

            console.log("Meeting Room Approved");

            console.log(data);

        }
    )
    socket.on(
        SERVER_EVENTS.JOIN_REJECTED, (data) => {

            console.log('Meeting Room Rejected');

            console.log(data);

        }
    )


}



































