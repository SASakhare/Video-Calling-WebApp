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

        // transportId -> Transport
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

    addTransport(transport) {

        this.transports.set(
            transport.id,
            transport
        );

    }

    getTransport(id) {

        return this.transports.get(id);

    }

    removeTransport(id) {

        this.transports.delete(id);

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

        return this.producers.get(id);

    }

    removeProducer(id) {

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

        return this.consumers.get(id);

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
        for (const transport of this.transports.values()) {

            transport.close();

        }

        this.transports.clear();

    }

}

export default MediaParticipant;