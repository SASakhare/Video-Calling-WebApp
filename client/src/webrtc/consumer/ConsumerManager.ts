import type {
    Consumer
} from "mediasoup-client/types";

import TransportManager from "../transport/TransportManager";

export interface ConsumeOptions {

    id: string;

    producerId: string;

    kind: MediaStreamTrack["kind"];

    rtpParameters: RTCRtpParameters;

    appData?: Record<string, unknown>;

}

class ConsumerManager {

    // =====================================================
    // State
    // =====================================================

    private consumers = new Map<string, Consumer>();


    // =====================================================
    // Consume
    // =====================================================

    async consume(
        options: ConsumeOptions
    ) {

        const recvTransport =
            TransportManager.getRecvTransport();

        const consumer =
            await recvTransport.consume({

                id: options.id,

                producerId: options.producerId,

                kind: options.kind,

                rtpParameters: options.rtpParameters,

                appData: options.appData,

            });

        this.consumers.set(
            consumer.id,
            consumer
        );

        console.log(
            `✅ Consumer Created : ${consumer.id}`
        );

        consumer.on(
            "transportclose",
            () => {

                console.log(
                    `Transport Closed : ${consumer.id}`
                );

                this.consumers.delete(
                    consumer.id
                );

            }
        );

        consumer.on(
            "close",
            () => {

                console.log(
                    `Consumer Closed : ${consumer.id}`
                );

                this.consumers.delete(
                    consumer.id
                );

            }
        );

        return consumer;

    }


    // =====================================================
    // Helpers
    // =====================================================

    getConsumer(id: string) {

        return this.consumers.get(id);

    }

    getConsumers() {

        return [...this.consumers.values()];

    }

    hasConsumer(id: string) {

        return this.consumers.has(id);

    }

    closeConsumer(id: string) {

        const consumer =
            this.consumers.get(id);

        if (!consumer) {

            return;

        }

        consumer.close();

        this.consumers.delete(id);

    }

    closeAll() {

        for (const consumer of this.consumers.values()) {

            consumer.close();

        }

        this.consumers.clear();

    }

}

export default new ConsumerManager();