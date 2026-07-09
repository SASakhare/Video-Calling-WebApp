import { Meeting } from "../models/meeting.models.js";
import { CustomError } from "../utils/customeError.js";


export const createMeetingDB = async (data) => {

    
    try {
        
        // * create Meeting and return Meeting details
        console.log(data);

        await Meeting.create(data);

    } catch (error) {

        console.error("ERROR - Meeting Creation Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meeting creating", 503);
    }

}






















