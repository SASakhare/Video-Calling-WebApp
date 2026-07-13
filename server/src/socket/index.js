import { Server } from "socket.io"
import { env } from "../config/env.js";
import { socketAuthMiddleware } from "./middleware/auth.middleware.js";
export let io;

export const initializeSocket=(server)=>{

    io=new Server(server,{
        cors:{
            origin:env.CLIENT_URL,
            credentials:true,
        },
        transports:['websocket']
    });

    // * Register Middleware
    io.use(socketAuthMiddleware)

    return io
}


export const getIO=()=>{

    if(!io){
        throw new Error("Socket.io not initialized");
    }

    return io;
}



















