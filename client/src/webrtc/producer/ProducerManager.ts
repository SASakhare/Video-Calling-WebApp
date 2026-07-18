import type {
    Producer
} from "mediasoup-client/types";

import TransportManager from "../transport/TransportManager";

class ProducerManager {

    private producers = new Map<string, Producer>();


    // =====================================================
    // Produce
    // =====================================================

    async produce(
        track: MediaStreamTrack,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appData: Record<string, any> = {}
    ) {

        const sendTransport =
            TransportManager.getSendTransport();

        const producer =
            await sendTransport.produce({

                track,

                appData,

            });

        this.producers.set(
            producer.id,
            producer
        );

        console.log(
            `✅ Producer Created : ${producer.id}`
        );

        producer.on(
            "transportclose",
            () => {

                console.log(
                    `Transport Closed : ${producer.id}`
                );

                this.producers.delete(
                    producer.id
                );

            }
        );

        producer.on(
            "close",
            () => {

                console.log(
                    `Producer Closed : ${producer.id}`
                );

                this.producers.delete(
                    producer.id
                );

            }
        );

        return producer;

    }

    // =====================================================
    // Helpers
    // =====================================================

    getProducer(id: string) {

        return this.producers.get(id);

    }

    getProducers() {

        return [...this.producers.values()];

    }

    closeProducer(id: string) {

        const producer =
            this.producers.get(id);

        if (!producer) {

            return;

        }

        producer.close();

        this.producers.delete(id);

    }

    closeAll() {

        for (const producer of this.producers.values()) {

            producer.close();

        }

        this.producers.clear();

    }

}

export default new ProducerManager();