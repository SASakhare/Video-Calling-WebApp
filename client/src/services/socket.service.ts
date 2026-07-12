import { Socket } from "socket.io-client";
import { socket } from "@/lib/socket";



class SocketService {

    private socket: Socket


    constructor() {
        this.socket = socket
    }

    //* Connect to socket server

    connect(token: string) {

        if (this.socket.connected) {
            console.log("Socket already connected to sever");
            return;
        }

        this.socket.auth = {
            token,
        };

        this.socket.connect();
        console.log("Socket Connected to Server");

    }


    // * Disconnect socket

    disconnect() {

        if (!this.socket.connected) {
            console.log("Socket already disconnected to sever");
            return;
        }

        this.socket.disconnect();
    }


    // * Emit Event :

    emit<T>(event: string, payload?: T) {

        this.socket.emit(event, payload);
    }


    // * Listen Event :



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on<T>(event: string, callback?: (...args: any[]) => void) {

        this.socket.on(event, callback);
    }


    // * Remove lister

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off<T>(event: string, callback?: (...args: any[]) => void) {

        if (callback) {
            this.socket.off(event, callback)
        } else {
            this.socket.off(event);
        }
    }

    // * Socket Instance 

    getSocket() {
        return this.socket;
    }


    // * Connection Status

    isConnected() {
        return this.socket.connected;
    }

}


export const socketService = new SocketService();





















