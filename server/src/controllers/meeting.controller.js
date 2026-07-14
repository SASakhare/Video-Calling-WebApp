import { v4 as uuid } from "uuid"
import { hashPassword } from "../utils/password.js";
import { createMeetingLink } from "../utils/meeting.utils.js";
import {getMeetingByMeetingIdDB,createMeetingDB, getMeetingsDB, getMeetingDB, updateMeetingDB, cancelMeetingDB } from "../services/meeting.database.service.js";
import { nanoid } from "nanoid";

export const createMeeting = async (req, res) => {

    try {
        const data = req.body;
        console.log(data);
        const passcode = data.passcode ? data.passcode : nanoid(5);
        const hashPasscode = passcode
        const meetingId = uuid();
        const meetingLink = createMeetingLink(meetingId);
        const meetingData = {
            meetingId: meetingId,
            hostId: req.userId,
            title: data.title,
            description: data.description,
            type_: data.type,
            status: 'CREATED',
            meetingPassword: hashPasscode,
            waitingRoomEnabled: data.waitingRoom,
            participantLimit: 100,
            scheduledStartTime: data.type == 'INSTANT' ? null : data.scheduledStartTime,
            scheduledEndTime: data.type == "INSTANT" ? null : data.scheduledEndTime,
            meetingLink: meetingLink,
            actualStartTime: null,
            actualEndTime: null,
        }

        await createMeetingDB(meetingData);

        res.status(200).json({
            success: true,
            message: "Meeting Created Successfully",
            meeting: {
                ...meetingData, meetingPassword: passcode,
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}





export const getMeetings = async (req, res) => {

    try {

        const userId = req.userId;
        console.log('userId (getMeetings) :', userId);

        const meetings = await getMeetingsDB(userId);

        res.status(200).json({
            success: true,
            message: "Meetings Fetched Successfully",
            meetings
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


export const getMeeting = async (req, res) => {

    try {

        const meetingId = req.params.meetingId;
        const userId = req.userId;
        console.log('meetingId (getMeeting) :', meetingId);
        console.log('userId (getMeeting) :', userId);

        const meeting = await getMeetingDB(userId, meetingId);

        res.status(200).json({
            success: true,
            message: "Meeting Fetched Successfully",
            meeting
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

export const getMeetingWithPasscode = async (req, res) => {

    try {

        const meetingId = req.params.meetingId;
        const passcode = req.params.passcode;
        console.log('meetingId (getMeeting) :', meetingId);
        console.log('passcode (getMeeting) :', passcode);

        const meeting = await getMeetingByMeetingIdDB(meetingId);

        res.status(200).json({
            success: true,
            message: "Meeting Fetched Successfully",
            meeting
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}



export const updateMeeting = async (req, res) => {

    try {

        const meetingId = req.params.meetingId;
        const userId = req.userId;
        const data = req.body;
        console.log('meetingId (getMeeting) :', meetingId);
        console.log('message update data :', data);


        const meeting = await updateMeetingDB(userId, meetingId, data);

        res.status(200).json({
            success: true,
            message: "Meetings Updated Successfully",
            meeting
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}


export const cancelMeeting = async (req, res) => {

    try {

        const meetingId = req.params.meetingId;
        const userId = req.userId;
        console.log('meetingId (getMeeting) :', meetingId);


        const meeting = await cancelMeetingDB(userId, meetingId);

        res.status(200).json({
            success: true,
            message: "Meetings Canceled Successfully",
            meeting
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}























