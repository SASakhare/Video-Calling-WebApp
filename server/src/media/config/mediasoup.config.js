export const mediaConfig = {

    worker: {

        rtcMinPort: 40000,

        rtcMaxPort: 49999,

        logLevel: "debug",

        logTags: [

            "info",
            "ice",
            "dtls",
            "rtp",
            "rtcp",
            "srtp",
            "rtx",
            "bwe",
            "score",
            "simulcast",
            "svc"

        ]

    },

    router: {

        mediaCodecs: [

            {

                kind: "audio",

                mimeType: "audio/opus",

                clockRate: 48000,

                channels: 2

            },

            {

                kind: "video",

                mimeType: "video/VP8",

                clockRate: 90000,

                parameters: {

                    "x-google-start-bitrate": 1000

                }

            }

        ]

    },

    webRtcTransport: {

        listenIps: [

            {

                ip: "0.0.0.0",

                announcedIp: process.env.PUBLIC_IP || undefined

            }

        ],

        enableUdp: true,

        enableTcp: true,

        preferUdp: true,

        initialAvailableOutgoingBitrate: 1000000

    }

};

