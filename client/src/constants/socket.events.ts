
/**
 * Client -> Server Events
 */
export const CLIENT_EVENTS = {
    //* Meeting Lifecycle
    MEETING_START: "meeting:start",
    MEETING_JOIN: "meeting:join",
    MEETING_LEAVE: "meeting:leave",
    MEETING_END: "meeting:end",

    //* Waiting Room
    MEETING_REQUEST_JOIN: "meeting:request-join",
    MEETING_ADMIT: "meeting:admit",
    MEETING_REJECT: "meeting:reject",

    // *  Participant 
    PARTICIPANT_ALLOW: "participant:allow",
    PARTICIPANT_REJECT: "participant:reject",


    //* Chat
    CHAT_SEND: "chat:send",
    CHAT_TYPING: "chat:typing",
    CHAT_STOP_TYPING: "chat:stop-typing",

    //* WebRTC Signaling
    WEBRTC_OFFER: "webrtc:offer",
    WEBRTC_ANSWER: "webrtc:answer",
    WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

    // * WebRTC Connection :
    MEDIA_CREATE_TRANSPORT:"media:createTransport",
    MEDIA_CONNECT_TRANSPORT:"media:connectTransport",
    MEDIA_PRODUCE:"media:produce",



    //* Media Controls
    PARTICIPANT_MIC: "participant:mic",
    PARTICIPANT_CAMERA: "participant:camera",
    PARTICIPANT_SCREEN_SHARE: "participant:screen-share",
    PARTICIPANT_HAND: "participant:hand",

} as const;

/**
 * Server -> Client Events
 */
export const SERVER_EVENTS = {
    //* Meeting
    MEETING_STARTED: "meeting:started",
    MEETING_ENDED: "meeting:ended",

    //* Waiting Room
    WAITING_ROOM_UPDATED: "waiting-room:updated",
    JOIN_APPROVED: "meeting:join-approved",
    JOIN_REJECTED: "meeting:join-rejected",

    //* Participants
    PARTICIPANTS_UPDATED: "participants:updated",
    PARTICIPANT_JOINED: "participant:joined",
    PARTICIPANT_LEFT: "participant:left",
    PARTICIPANT_WAITING: "participant:waiting",
    PARTICIPANT_ALLOWED: "participant:allowed",
    PARTICIPANT_REJECTED: "participant:rejected",

    //* Chat
    CHAT_RECEIVED: "chat:received",
    CHAT_TYPING: "chat:typing",

    //* WebRTC
    WEBRTC_OFFER: "webrtc:offer",
    WEBRTC_ANSWER: "webrtc:answer",
    WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

    // * WebRTC Connection :
    MEDIA_CREATED_TRANSPORT:"media:transportCreated",
    MEDIA_ERROR:"media:error",


    //* Error
    ERROR: "error",
} as const;







