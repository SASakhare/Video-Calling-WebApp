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


export const getMeetingsDB = async (userId) => {


    try {

        // * create Meeting and return Meeting details

        const meetings = await Meeting.find({ hostId: userId });

        return meetings;

    } catch (error) {

        console.error("ERROR - Meetings Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meetings Fetching", 503);
    }

}

export const getMeetingDB = async (userId, meetingId) => {


    try {

        // * create Meeting and return Meeting details

        const meeting = await Meeting.findOne({ meetingId });
        // console.log(meeting);

        // if(meeting==){
        //     throw new CustomError("Meeting Not Found",400)
        // }
        
        if (meeting.hostId != userId) {
            throw new CustomError("Error while Meetings Fetching", 503);
        }

        return meeting;

    } catch (error) {

        console.error("ERROR - Meeting Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meeting Fetching", 503);
    }

}
export const getMeetingByMeetingIdDB = async (meetingId) => {


    try {

        // * create Meeting and return Meeting details

        const meeting = await Meeting.findOne({ meetingId });
        // console.log(meeting);

        // if(meeting==){
        //     throw new CustomError("Meeting Not Found",400)
        // }

        return meeting;

    } catch (error) {

        console.error("ERROR - Meeting Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meeting Fetching", 503);
    }

}


export const updateMeetingDB = async (userId, meetingId, data) => {


    try {

        // * create Meeting and return Meeting details

        const meeting = await Meeting.findOneAndUpdate({ hostId: userId, meetingId }, data, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            throw new CustomError("Error while Meeting Update", 503);
        }

        // const meeting=await Meeting.

        return meeting;

    } catch (error) {

        console.error("ERROR - Meeting Update Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meeting Update", 503);
    }

}


export const cancelMeetingDB = async (userId, meetingId) => {


    try {

        // * create Meeting and return Meeting details
        const meetingData = {
            status: 'CANCELLED',
        }
        const meeting = await Meeting.findOneAndUpdate({ hostId: userId, meetingId }, meetingData, {
            new: true,
            runValidators: true,
        });

        if (!meeting) {
            throw new CustomError("Error while Meeting Canceling", 503);
        }


        return meeting;

    } catch (error) {

        console.error("ERROR - Meeting Cancel Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Meeting Cancel", 503);
    }

}

























