import { create } from "zustand";

type ProducerStreams = Map<string, MediaStream>;

interface MeetingMediaState {

    //^ =====================================================
    //^ State
    //^ =====================================================

    localStream: MediaStream | null;

    //^ participantId -> (producerId -> MediaStream)
    remoteStreams: Map<string, ProducerStreams>;

    //^ =====================================================
    //^ Local Stream
    //^ =====================================================

    setLocalStream: (
        stream: MediaStream | null
    ) => void;

    clearLocalStream: () => void;

    //^ =====================================================
    //^ Remote Streams
    //^ =====================================================

    addRemoteStream: (
        participantId: string,
        producerId: string,
        stream: MediaStream
    ) => void;

    getRemoteStream: (
        participantId: string,
        producerId: string
    ) => MediaStream | undefined;

    getParticipantStreams: (
        participantId: string
    ) => ProducerStreams | undefined;

    hasRemoteStream: (
        participantId: string,
        producerId: string
    ) => boolean;

    removeRemoteStream: (
        participantId: string,
        producerId: string
    ) => void;

    removeParticipantStreams: (
        participantId: string
    ) => void;

    clearRemoteStreams: () => void;

    //^ =====================================================
    //^ Cleanup
    //^ =====================================================

    clearAllStreams: () => void;
}

export const useMeetingMediaStore =
    create<MeetingMediaState>((set, get) => ({

        //^ =====================================================
        //^ State
        //^ =====================================================

        localStream: null,

        remoteStreams: new Map(),

        //^ =====================================================
        //^ Local
        //^ =====================================================

        setLocalStream: (stream) =>
            set({
                localStream: stream
            }),

        clearLocalStream: () =>
            set({
                localStream: null
            }),

        //^ =====================================================
        //^ Remote
        //^ =====================================================

        addRemoteStream: (
            participantId,
            producerId,
            stream
        ) => {

            const next =
                new Map(get().remoteStreams);

            let participantStreams =
                next.get(participantId);

            if (!participantStreams) {

                participantStreams =
                    new Map();

                next.set(
                    participantId,
                    participantStreams
                );

            }

            participantStreams.set(
                producerId,
                stream
            );

            set({
                remoteStreams: next
            });

        },

        getRemoteStream: (
            participantId,
            producerId
        ) => {

            return get()
                .remoteStreams
                .get(participantId)
                ?.get(producerId);

        },

        getParticipantStreams: (
            participantId
        ) => {

            return get()
                .remoteStreams
                .get(participantId);

        },

        hasRemoteStream: (
            participantId,
            producerId
        ) => {

            return get()
                .remoteStreams
                .get(participantId)
                ?.has(producerId) ?? false;

        },

        removeRemoteStream: (
            participantId,
            producerId
        ) => {

            const next =
                new Map(get().remoteStreams);

            const participantStreams =
                next.get(participantId);

            if (!participantStreams) {

                return;

            }

            participantStreams.delete(
                producerId
            );

            if (
                participantStreams.size === 0
            ) {

                next.delete(
                    participantId
                );

            }

            set({
                remoteStreams: next
            });

        },

        removeParticipantStreams: (
            participantId
        ) => {

            const next =
                new Map(get().remoteStreams);

            next.delete(
                participantId
            );

            set({
                remoteStreams: next
            });

        },

        clearRemoteStreams: () =>
            set({
                remoteStreams: new Map()
            }),

        // =====================================================
        // Cleanup
        // =====================================================

        clearAllStreams: () =>
            set({

                localStream: null,

                remoteStreams: new Map()

            })

    }));