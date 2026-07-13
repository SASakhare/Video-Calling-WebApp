import { Socket } from "socket.io-client";

import { registerMeetingHandlers } from "./handlers/meeting.handler";
import { registerParticipantHandlers } from "./handlers/participant.handler";

export function registerSocketHandlers(socket: Socket) {

    registerMeetingHandlers(socket);

    registerParticipantHandlers(socket);

    // registerChatHandlers(socket);

    // registerWebRTCHandlers(socket);

}