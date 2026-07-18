import { Device } from "mediasoup-client"

import type { RtpCapabilities } from "mediasoup-client/types"




class MediaDeviceManager {


    private device: Device | null = null

    // * loading the mediasoup client device
    async load(
        routerRtpCapabilities: RtpCapabilities,
    ) {

        if (this.device) {
            console.log("Device already loaded");

            return this.device
        };

        const device = new Device()

        await device.load({
            routerRtpCapabilities,
        })


        this.device = device;

        console.log("✅ Mediasoup Device Loaded");

        return device;
    }


    getDevice() {

        if (!this.device) {
            throw new Error(
                "Mediasoup device not initialized"
            );
        }

        return this.device;
    }


    isLoaded() {
        return !!this.device;
    }


    close() {
        this.device = null;
    }

}



export default new MediaDeviceManager();






















