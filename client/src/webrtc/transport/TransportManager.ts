import type { Transport } from "mediasoup-client/types";
import MediaDevice from "../core/MediaDevice";
import { socket } from "@/lib/socket";
import { CLIENT_EVENTS, SERVER_EVENTS } from "@/constants/socket.events";
import { Socket } from "socket.io-client";


class TransportManager {


    private sendTransport: Transport | null = null;

    private recvTransport: Transport | null = null;

    private socket: Socket | null = null;

    initialize(socket: Socket) {
        this.socket = socket
    }

    // =====================================================
    // Create Send Transport
    // =====================================================


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createSendTransport(data: any) {


        const device =
            MediaDevice.getDevice();



        this.sendTransport =
            device.createSendTransport({

                id: data.id,

                iceParameters:
                    data.iceParameters,

                iceCandidates:
                    data.iceCandidates,

                dtlsParameters:
                    data.dtlsParameters,

            });



        console.log(
            "✅ Send Transport Created"
        );

        // * this only register the event ,not going to fire
        this.sendTransport.on(
            "connect",
            async (
                { dtlsParameters },
                callback,
                errback

            ) => {

                try {
                    this.socket.emit(
                        CLIENT_EVENTS.MEDIA_CONNECT_TRANSPORT,
                        {
                            direction: "send",
                            dtlsParameters
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (response: any) => {
                            if (!response.success) {

                                return errback(
                                    new Error(response.message)
                                );
                            }
                            callback();
                        }
                    )

                } catch (error) {
                    errback(error as Error)
                }

            }
        )

        this.sendTransport.on(
            "produce",
            async (
                { kind, rtpParameters, appData },
                callback,
                errback
            ) => {

                try {

                    this.socket!.emit(
                        CLIENT_EVENTS.MEDIA_PRODUCE,
                        {
                            kind,
                            rtpParameters,
                            appData,
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (response: any) => {

                            if (!response.success) {

                                return errback(
                                    new Error(response.message)
                                );

                            }

                            callback({
                                id: response.producerId,
                            });

                        }
                    );

                } catch (error) {

                    errback(error as Error);

                }

            }
        );



        return this.sendTransport;

    }





    // =====================================================
    // Create Receive Transport
    // =====================================================


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createRecvTransport(data: any) {


        const device =
            MediaDevice.getDevice();



        this.recvTransport =
            device.createRecvTransport({

                id: data.id,

                iceParameters:
                    data.iceParameters,

                iceCandidates:
                    data.iceCandidates,

                dtlsParameters:
                    data.dtlsParameters,

            });



        console.log(
            "✅ Receive Transport Created"
        );


        return this.recvTransport;

    }





    getSendTransport() {


        if (!this.sendTransport) {

            throw new Error(
                "Send transport not created"
            );

        }


        return this.sendTransport;

    }





    getRecvTransport() {


        if (!this.recvTransport) {

            throw new Error(
                "Receive transport not created"
            );

        }


        return this.recvTransport;

    }




    close() {

        if (this.sendTransport) {

            this.sendTransport.close();

            this.sendTransport = null;

        }


        if (this.recvTransport) {

            this.recvTransport.close();

            this.recvTransport = null;

        }

    }


}


export default new TransportManager();