class MediaRoom {

    constructor(meetingId, router) {

        this.meetingId = meetingId;

        this.router = router;

        // Key -> participantId
        // Value -> MediaParticipant
        this.participants = new Map();

        this.createdAt = new Date();

    }

    //^ =====================================================
    //^ Participant Management
    //^ =====================================================

    addParticipant(participant) {

        this.participants.set(
            participant.participantId,
            participant
        );

    }

    removeParticipant(participantId) {

        this.participants.delete(participantId);

    }

    getParticipant(participantId) {

        return this.participants.get(participantId);

    }

    hasParticipant(participantId) {

        return this.participants.has(participantId);

    }

    getParticipants() {

        return [...this.participants.values()];

    }

    getParticipantCount() {

        return this.participants.size;

    }

    isEmpty() {

        return this.participants.size === 0;

    }

    clearParticipants() {

        this.participants.clear();

    }

    //^ =====================================================
    //^ Router
    //^ =====================================================

    getRouter() {

        return this.router;

    }

    getMeetingId() {

        return this.meetingId;

    }

    //^ =====================================================
    //^ Room Lifecycle
    //^ =====================================================

    async close() {

        // Close every participant first

        for (const participant of this.participants.values()) {

            if (participant.close) {

                await participant.close();

            }

        }

        this.participants.clear();

        if (this.router) {

            this.router.close();

        }

    }

}

export default MediaRoom;