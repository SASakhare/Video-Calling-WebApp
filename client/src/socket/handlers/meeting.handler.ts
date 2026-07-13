import { Socket } from "socket.io-client";
import { SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";


export const registerMeetingHandlers = (socket: Socket) => {

    // * ----------------- Meeting Event ----------------
    socket.on(
        SERVER_EVENTS.MEETING_STARTED, (data) => {

            console.log('Meeting Started');

            console.log(data);

        }
    )
    socket.on(
        SERVER_EVENTS.MEETING_ENDED, (data) => {

            console.log('Meeting Ended');

            console.log(data);

        }
    )

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



































