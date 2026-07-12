/*

Only meeting lifecycle events.

    meeting:start

    meeting:join

    meeting:leave

    meeting:end

*/

import { CLIENT_EVENTS } from "../constants/socket.events.js";



export const registerMeetingEvents = (io, socket) => {

    // * Meeting Join 

    socket.on(CLIENT_EVENTS.MEETING_JOIN, async (payload) => {

        console.log("Meeting Join");
        console.log(payload);

    })

    // * Meeting Start 

    socket.on(CLIENT_EVENTS.MEETING_START, async (payload) => {

        console.log("Meeting Start");
        console.log(payload);

    })

    // * Meeting Leave 

    socket.on(CLIENT_EVENTS.MEETING_LEAVE, async (payload) => {

        console.log("Meeting Leave");
        console.log(payload);


    })
    // * Meeting End

    socket.on(CLIENT_EVENTS.MEETING_END, async (payload) => {

        console.log("Meeting End");
        console.log(payload);

    })

}




