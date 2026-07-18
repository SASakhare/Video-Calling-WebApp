import { Socket } from "socket.io";
import { registerMeetingEvents } from "./events/meeting.events.js";
import { registerMediaEvents } from "./events/webrtc.events.js"



export const registerSocketEvents = (io) => {

    // * 
    io.on("connection", (socket) => {

        console.log(`Socket Connected : ${socket.id}`);

        // * we create socket room meeting  and meeting Id

        // * registering Meeting Events
        registerMeetingEvents(io, socket);
        registerMediaEvents(io, socket);


        // * 


        socket.on("disconnect", () => {

            console.log(`Socket Disconnected :${socket.id}`);

        })

    })

}












