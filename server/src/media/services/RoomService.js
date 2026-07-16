import WorkerService from "./WorkerService.js";
import MediaRoom from "../models/MediaRoom.js";
import MediaParticipant from "../models/MediaParticipant.js";
import { mediaConfig } from "../config/mediasoup.config.js";

class RoomService {

    constructor() {

        // meetingId -> MediaRoom
        this.rooms = new Map();

        // participantId -> meetingId
        this.participantRoomMap = new Map();

        // socket.id -> participantId
        this.socketParticipantMap = new Map();

    }

    // =====================================================
    // Room Management
    // =====================================================

    async createRoom(meetingId) {

        if (this.rooms.has(meetingId)) {
            return this.rooms.get(meetingId);
        }

        const worker = WorkerService.getWorker();

        const router = await worker.createRouter({

            mediaCodecs: mediaConfig.router.mediaCodecs,

        });

        const room = new MediaRoom(meetingId, router);

        this.rooms.set(meetingId, room);

        console.log(`✅ Media Room Created : ${meetingId}`);

        return room;

    }

    getRoom(meetingId) {

        return this.rooms.get(meetingId);

    }

    hasRoom(meetingId) {

        return this.rooms.has(meetingId);

    }

    async deleteRoom(meetingId) {

        const room = this.rooms.get(meetingId);

        if (!room) return;

        // Remove participant mappings

        for (const participant of room.getParticipants()) {

            this.participantRoomMap.delete(
                participant.participantId
            );

            if (participant.socket) {

                this.socketParticipantMap.delete(
                    participant.socket.id
                );

            }

        }

        await room.close();

        this.rooms.delete(meetingId);

        console.log(`🗑️ Media Room Deleted : ${meetingId}`);

    }

    // =====================================================
    // Participant Management
    // =====================================================

    joinParticipant({

        meetingId,

        participantId,

        userId,

        socket,

    }) {

        const room = this.rooms.get(meetingId);

        if (!room) {

            throw new Error("Media Room not found.");

        }

        let participant = room.getParticipant(participantId);

        // Reconnection
        // Reconnection
        if (participant) {

            const oldSocket = participant.getSocket();

            if (oldSocket) {

                this.socketParticipantMap.delete(oldSocket.id);

            }

            participant.updateSocket(socket);

            this.socketParticipantMap.set(
                socket.id,
                participantId
            );

            console.log(
                `🔄 Participant Reconnected : ${participantId}`
            );

            return participant;

        }

        participant = new MediaParticipant({

            participantId,

            userId,

            socket,

        });

        room.addParticipant(participant);

        this.participantRoomMap.set(

            participantId,

            meetingId

        );

        this.socketParticipantMap.set(

            socket.id,

            participantId

        );

        console.log(
            `👤 Participant Joined : ${participantId}`
        );

        return participant;

    }

    async leaveParticipant(socketId) {

        const participantId = this.socketParticipantMap.get(socketId);

        if (!participantId) return;

        const meetingId = this.participantRoomMap.get(participantId);

        if (!meetingId) return;

        const room = this.rooms.get(meetingId);

        if (!room) return;

        const participant = room.getParticipant(participantId);

        if (participant) {

            await participant.close();

            room.removeParticipant(participantId);

        }

        this.socketParticipantMap.delete(socketId);

        this.participantRoomMap.delete(participantId);

        console.log(
            `👋 Participant Left : ${participantId}`
        );

        if (room.isEmpty()) {

            await this.deleteRoom(meetingId);

        }

    }

    // =====================================================
    // Lookup
    // =====================================================

    getParticipant(participantId) {

        const meetingId = this.participantRoomMap.get(participantId);

        if (!meetingId) return null;

        const room = this.rooms.get(meetingId);

        if (!room) return null;

        return room.getParticipant(participantId);

    }

    getRoomByParticipant(participantId) {

        const meetingId = this.participantRoomMap.get(participantId);

        if (!meetingId) return null;

        return this.rooms.get(meetingId);

    }

    getParticipantBySocket(socketId) {

        const participantId = this.socketParticipantMap.get(socketId);

        if (!participantId) return null;

        return this.getParticipant(participantId);

    }

    updateParticipantSocket(participantId, socket) {

        const participant = this.getParticipant(participantId);

        if (!participant) return;

        const oldSocket = participant.getSocket();

        if (oldSocket) {

            this.socketParticipantMap.delete(oldSocket.id);

        }

        participant.updateSocket(socket);

        this.socketParticipantMap.set(
            socket.id,
            participantId
        );

    }

}

export default new RoomService(); n