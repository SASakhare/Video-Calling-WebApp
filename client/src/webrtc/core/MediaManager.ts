import MediaDevice from "./MediaDevice";
import { RtpCapabilities } from "mediasoup-client/types";


class MediaManager {


    async initialize(
        routerRtpCapabilities: RtpCapabilities
    ) {

        console.log('Initializing WebRTC....');

        const device = await MediaDevice.load(routerRtpCapabilities);


        console.log("WebRTC Initialized");

        return device;
    }


    getDevice() {
        return MediaDevice.getDevice();
    }


    close() {

        MediaDevice.close();
    }


}






export default new MediaManager();



