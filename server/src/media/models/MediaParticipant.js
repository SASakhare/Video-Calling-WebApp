class MediaParticipant {

    constructor({
        participantId,// *
        meetingId,
        hostId,

        userId, // *
        username,
        fullName,
        avatar,

        role,

        socket, // *
    }) {

        // =====================================================
        // Identity
        // =====================================================

        this.participantId = participantId;
        this.userId = userId;

        this.username = username;
        this.fullName = fullName;
        this.avatar = avatar ?? null;

        // =====================================================
        // Meeting
        // =====================================================

        this.meetingId = meetingId;
        this.hostId = hostId;
        this.role = role;

        this.joinedAt = new Date();

        // =====================================================
        // Presence State
        // =====================================================

        this.connectionState = "CONNECTED";

        this.isMicOn = true;
        this.isCameraOn = true;
        this.isScreenSharing = false;
        this.isHandRaised = false;
        this.isRecording = false;
        this.isSpeaking = false;

        // =====================================================
        // Socket
        // =====================================================

        this.socket = socket;

        // =====================================================
        // MediaSoup Resources
        // =====================================================

        /*
            transportId ->
            {
                type:"send" | "recv",
                transport
            }
        */

        this.transports = new Map();

        // producerId -> Producer
        this.producers = new Map();

        // consumerId -> Consumer
        this.consumers = new Map();

    }

    // =====================================================
    // Identity
    // =====================================================

    getParticipantId() {
        return this.participantId;
    }

    getMeetingId() {
        return this.meetingId;
    }

    getHostId() {
        return this.hostId;
    }

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getFullName() {
        return this.fullName;
    }

    getAvatar() {
        return this.avatar;
    }

    getRole() {
        return this.role;
    }

    getJoinedAt() {
        return this.joinedAt;
    }

    // =====================================================
    // Presence
    // =====================================================

    setMic(state) {
        this.isMicOn = state;
    }

    setCamera(state) {
        this.isCameraOn = state;
    }

    setScreenSharing(state) {
        this.isScreenSharing = state;
    }

    setHandRaised(state) {
        this.isHandRaised = state;
    }

    setRecording(state) {
        this.isRecording = state;
    }

    setSpeaking(state) {
        this.isSpeaking = state;
    }

    setConnectionState(state) {
        this.connectionState = state;
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

    removeTransport(id) {

        const transport = this.transports.get(id);

        if (!transport) return;

        transport.transport.close();

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

        const producer = this.producers.get(id);

        if (!producer) return;

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

        const consumer = this.consumers.get(id);

        if (!consumer) return;

        consumer.close();

        this.consumers.delete(id);

    }

    getConsumers() {

        return [...this.consumers.values()];

    }

    // =====================================================
    // DTO
    // =====================================================

    toDTO() {

        return {

            participantId: this.participantId,

            meetingId: this.meetingId,

            hostId: this.hostId,

            userId: this.userId,

            username: this.username,

            fullName: this.fullName,

            avatar: this.avatar,

            role: this.role,

            joinedAt: this.joinedAt,

            connectionState: this.connectionState,

            isMicOn: this.isMicOn,

            isCameraOn: this.isCameraOn,

            isScreenSharing: this.isScreenSharing,

            isHandRaised: this.isHandRaised,

            isRecording: this.isRecording,

            isSpeaking: this.isSpeaking,

            producers: this.getProducers().map((producer) => ({
                producerId: producer.id,
                kind: producer.kind,
                appData: producer.appData,
            })),
        };

    }

    // =====================================================
    // Cleanup
    // =====================================================

    async close() {

        for (const producer of this.producers.values()) {
            producer.close();
        }

        this.producers.clear();

        for (const consumer of this.consumers.values()) {
            consumer.close();
        }

        this.consumers.clear();

        for (const { transport } of this.transports.values()) {
            transport.close();
        }

        this.transports.clear();

        this.connectionState = "DISCONNECTED";

    }

}

export default MediaParticipant;