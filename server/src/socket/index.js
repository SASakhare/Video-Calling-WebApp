import { Server } from "socket.io"
import { env } from "../config/env.js";

export let io;

export const initializeSocket=(server)=>{

    io=new Server(server,{
        cors:{
            origin:env.CLIENT_URL,
            credentials:true,
        },
        transports:['websocket']
    });

    return io
}


export const getIO=()=>{

    if(!io){
        throw new Error("Socket.io not initialized");
    }

    return io;
}



















