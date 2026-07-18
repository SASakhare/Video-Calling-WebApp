import * as mediasoup from "mediasoup";
import { mediaConfig } from "../config/mediasoup.config.js";

class WorkerService {

    constructor() {

        this.worker = null;

    }

    // ===============================
    // Create Worker
    // ===============================

    async initialize() {

        if (this.worker) {

            return this.worker;

        }
    
        // * it is creating the worker
        this.worker = await mediasoup.createWorker({

            rtcMinPort: mediaConfig.worker.rtcMinPort,

            rtcMaxPort: mediaConfig.worker.rtcMaxPort,

            logLevel: mediaConfig.worker.logLevel,

            logTags: mediaConfig.worker.logTags,

        });

        console.log("✅ MediaSoup Worker Started");

        this.worker.on("died", () => {

            console.error("❌ MediaSoup Worker Died");

            setTimeout(() => {

                process.exit(1);

            }, 2000);

        });

        return this.worker;

    }

    //^ ===============================
    //^ Get Worker
    //^ ===============================

    getWorker() {

        if (!this.worker) {

            throw new Error("MediaSoup Worker not initialized.");

        }

        return this.worker;

    }

}

export default new WorkerService();