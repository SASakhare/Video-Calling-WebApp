import { Socket } from "socket.io-client";
import { SERVER_EVENTS } from "@/constants/socket.events";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/lib/socket";


export const registerParticipantHandlers = (socket: Socket) => {

    // * ----------------- Participant Event ----------------
    socket.on(
        SERVER_EVENTS.PARTICIPANT_JOINED, (data) => {

            console.log('PARTICIPANT_JOINED');

            console.log(data);
            useMeetingStore.getState().addMeetingParticipant(data);
            // useMeetingStore.getState().setProducers(data)

        }
    )
    socket.on(
        SERVER_EVENTS.PARTICIPANT_LEFT, (data) => {

            console.log('Meeting Ended');

            console.log(data);

        }
    )



}










































































