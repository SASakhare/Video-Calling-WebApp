import env from "@/utils/environment";

import { io } from "socket.io-client";


console.log(env.BASE_URL);


export const  socket = io(env.BASE_URL, {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
});



























