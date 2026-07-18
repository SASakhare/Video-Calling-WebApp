class MediaParticipant {

    constructor({
        participantId,
        userId,
        socket,
    }) {

        this.participantId = participantId;
        this.userId = userId;
        this.socket = socket;

        // =====================================================
        // MediaSoup Resources
        // =====================================================

        /*
            transportId -> {
                type: "send" | "recv",
                transport
            }
        */
        this.transports = new Map();

        // producerId -> Producer
        this.producers = new Map();

        // consumerId -> Consumer
        this.consumers = new Map();

        // =====================================================
        // Participant State
        // =====================================================

        this.joinedAt = new Date();

    }

    // =====================================================
    // Basic Information
    // =====================================================

    getParticipantId() {

        return this.participantId;

    }

    getUserId() {

        return this.userId;

    }

    getJoinedAt() {

        return this.joinedAt;

    }

    // =====================================================
    // Socket
    // =====================================================

    updateSocket(socket) {

        this.socket = socket;

    }

    getSocket() {

        return this.socket;

    }

    // =====================================================
    // Transport
    // =====================================================

    addTransport(type, transport) {

        this.transports.set(
            transport.id,
            {
                type,
                transport,
            }
        );

    }

    getTransport(id) {

        return this.transports.get(id)?.transport ?? null;

    }

    getTransportByType(type) {

        for (const { type: transportType, transport } of this.transports.values()) {

            if (transportType === type) {

                return transport;

            }

        }

        return null;

    }

    hasTransport(type) {

        return this.getTransportByType(type) !== null;

    }

    removeTransport(id) {

        this.transports.delete(id);

    }

    removeTransportByType(type) {

        for (const [id, value] of this.transports.entries()) {

            if (value.type === type) {

                value.transport.close();

                this.transports.delete(id);

                return true;

            }

        }

        return false;

    }

    getTransports() {

        return [...this.transports.values()];

    }

    // =====================================================
    // Producers
    // =====================================================

    addProducer(producer) {

        this.producers.set(
            producer.id,
            producer
        );

    }

    getProducer(id) {

        return this.producers.get(id) ?? null;

    }

    removeProducer(id) {

        const producer =
            this.producers.get(id);

        if (!producer) {

            return;

        }

        producer.close();

        this.producers.delete(id);

    }
    
    getProducers() {

        return [...this.producers.values()];

    }

    // =====================================================
    // Consumers
    // =====================================================

    addConsumer(consumer) {

        this.consumers.set(
            consumer.id,
            consumer
        );

    }

    getConsumer(id) {

        return this.consumers.get(id) ?? null;

    }

    removeConsumer(id) {

        this.consumers.delete(id);

    }

    getConsumers() {

        return [...this.consumers.values()];

    }

    // =====================================================
    // Cleanup
    // =====================================================

    async close() {

        // Close Producers
        for (const producer of this.producers.values()) {

            producer.close();

        }

        this.producers.clear();

        // Close Consumers
        for (const consumer of this.consumers.values()) {

            consumer.close();

        }

        this.consumers.clear();

        // Close Transports
        for (const { transport } of this.transports.values()) {

            transport.close();

        }

        this.transports.clear();

    }

}

export default MediaParticipant;