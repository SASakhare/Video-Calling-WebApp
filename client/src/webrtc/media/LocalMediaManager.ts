
class LocalMediaManager {

    // =====================================================
    // Media
    // =====================================================

    private stream: MediaStream | null = null;

    private videoTrack: MediaStreamTrack | null = null;

    private audioTrack: MediaStreamTrack | null = null;

    private screenTrack: MediaStreamTrack | null = null;

    // =====================================================
    // Initialize Camera + Microphone
    // =====================================================

    async initialize() {

        if (this.stream) {

            return this.stream;

        }

        this.stream = await navigator.mediaDevices.getUserMedia({

            video: true,

            audio: true,

        });

        this.videoTrack =
            this.stream.getVideoTracks()[0] ?? null;

        this.audioTrack =
            this.stream.getAudioTracks()[0] ?? null;

        console.log("✅ Local Media Initialized");

        return this.stream;

    }

    // =====================================================
    // Stream
    // =====================================================

    getStream() {

        if (!this.stream) {

            throw new Error(
                "Local media not initialized."
            );

        }

        return this.stream;

    }

    // =====================================================
    // Tracks
    // =====================================================

    getVideoTrack() {

        return this.videoTrack;

    }

    getAudioTrack() {

        return this.audioTrack;

    }

    getScreenTrack() {

        return this.screenTrack;

    }

    // =====================================================
    // State
    // =====================================================

    hasVideo() {

        return !!this.videoTrack;

    }

    hasAudio() {

        return !!this.audioTrack;

    }

    hasScreenShare() {

        return !!this.screenTrack;

    }

    // =====================================================
    // Cleanup
    // =====================================================

    stop() {

        this.stream?.getTracks().forEach(track => {

            track.stop();

        });

        this.stream = null;

        this.videoTrack = null;

        this.audioTrack = null;

        this.screenTrack = null;

    }

}

export default new LocalMediaManager();