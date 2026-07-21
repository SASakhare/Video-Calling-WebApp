import { ConsumeOptions, MeetingParticipant, ParticipantProducer } from "@/types";
import { useMeetingMediaStore } from "@/store/meetingMedia.store";
import TransportManager from "../transport/TransportManager";
import type { Consumer } from "mediasoup-client/types";
import { useAuthStore } from "@/store/auth.store";
import { socket } from "@/lib/socket";
import { CLIENT_EVENTS } from "@/constants/socket.events";
import MediaManager from "../core/MediaManager";

class ConsumerManager {
    
    // =====================================================
    // State
    // =====================================================
    
    // participantId -> (producerId -> Consumer)
    private consumers = new Map<
    string,
    Map<string, Consumer>
    >();
    
    private socket=socket;

    async consumeMeeting(
        participants: MeetingParticipant[],
    ) {

        const user =
            useAuthStore.getState().user;

        for (const participant of participants) {

            if (
                participant.userId ===
                user.userId
            ) {
                continue;
            }

            await this.consumeParticipant(
                participant
            );

        }

    }


    async consumeParticipant(
        participant: MeetingParticipant
    ) {

        for (
            const producer
            of participant.producers
        ) {

            await this.requestConsumer(
                participant,
                producer
            );

        }

    }

    private requestConsumer(
        participant: MeetingParticipant,
        producer: ParticipantProducer
    ): Promise<void> {

        return new Promise((resolve, reject) => {

            this.socket.emit(

                CLIENT_EVENTS.MEDIA_CONSUME,

                {

                    producerId:
                        producer.producerId,

                    rtpCapabilities:
                        MediaManager
                            .getDevice()
                            .rtpCapabilities,

                },

                async (response) => {

                    if (!response.success) {

                        return reject(
                            new Error(
                                response.message
                            )
                        );

                    }

                    try {

                        await this.consume({

                            participantId:
                                participant.participantId,

                            producerId:
                                response.consumer.producerId,

                            id:
                                response.consumer.id,

                            kind:
                                response.consumer.kind,

                            rtpParameters:
                                response.consumer.rtpParameters,

                            appData:
                                response.consumer.appData,

                        });

                        resolve();

                    } catch (error) {

                        reject(error);

                    }

                }

            );

        });

    }


    // =====================================================
    // Consume
    // =====================================================

    async consume(
        options: ConsumeOptions
    ) {

        // =====================================================
        // Already Consuming
        // =====================================================

        if (
            this.hasConsumer(
                options.participantId,
                options.producerId
            )
        ) {

            return this.getConsumer(
                options.participantId,
                options.producerId
            )!;

        }

        // =====================================================
        // Create Consumer
        // =====================================================

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

        // =====================================================
        // Create MediaStream
        // =====================================================

        const stream = new MediaStream();

        stream.addTrack(
            consumer.track
        );

        console.log("Media Stream Created");

        // =====================================================
        // Store MediaStream
        // =====================================================

        useMeetingMediaStore
            .getState()
            .addRemoteStream(
                options.participantId,
                options.producerId,
                stream
            );

        // =====================================================
        // Store Consumer
        // =====================================================

        let participantConsumers =
            this.consumers.get(
                options.participantId
            );

        if (!participantConsumers) {

            participantConsumers =
                new Map();

            this.consumers.set(
                options.participantId,
                participantConsumers
            );

        }

        participantConsumers.set(
            options.producerId,
            consumer
        );

        console.log(
            `✅ Consumer Created : ${consumer.id}`
        );

        // =====================================================
        // Events
        // =====================================================

        consumer.on(
            "transportclose",
            () => {

                console.log(
                    `Transport Closed : ${consumer.id}`
                );

                this.closeConsumer(
                    options.participantId,
                    options.producerId
                );

            }
        );

        consumer.on(
            "close",
            () => {

                console.log(
                    `Consumer Closed : ${consumer.id}`
                );

                this.closeConsumer(
                    options.participantId,
                    options.producerId
                );

            }
        );

        return consumer;

    }

    // =====================================================
    // Helpers
    // =====================================================

    getConsumer(
        participantId: string,
        producerId: string
    ) {

        return this.consumers
            .get(participantId)
            ?.get(producerId);

    }

    hasConsumer(
        participantId: string,
        producerId: string
    ) {

        return this.consumers
            .get(participantId)
            ?.has(producerId) ?? false;

    }

    getParticipantConsumers(
        participantId: string
    ) {

        return this.consumers.get(
            participantId
        );

    }

    closeConsumer(
        participantId: string,
        producerId: string
    ) {

        const participantConsumers =
            this.consumers.get(
                participantId
            );

        if (!participantConsumers) {

            return;

        }

        const consumer =
            participantConsumers.get(
                producerId
            );

        if (!consumer) {

            return;

        }

        consumer.close();

        participantConsumers.delete(
            producerId
        );

        useMeetingMediaStore
            .getState()
            .removeRemoteStream(
                participantId,
                producerId
            );

        if (
            participantConsumers.size === 0
        ) {

            this.consumers.delete(
                participantId
            );

        }

    }

    closeParticipantConsumers(
        participantId: string
    ) {

        const participantConsumers =
            this.consumers.get(
                participantId
            );

        if (!participantConsumers) {

            return;

        }

        for (
            const consumer of
            participantConsumers.values()
        ) {

            consumer.close();

        }

        this.consumers.delete(
            participantId
        );

        useMeetingMediaStore
            .getState()
            .removeParticipantStreams(
                participantId
            );

    }

    closeAll() {

        for (
            const participantConsumers of
            this.consumers.values()
        ) {

            for (
                const consumer of
                participantConsumers.values()
            ) {

                consumer.close();

            }

        }

        this.consumers.clear();

        useMeetingMediaStore
            .getState()
            .clearRemoteStreams();

    }

}

export default new ConsumerManager();