import { createParticipantDB, leaveParticipantDB ,getCurrentParticipantDB,getParticipantsDB} from "../services/participant.database.service";
import { v4 as uuid } from "uuid"


export const createParticipant = async (req, res) => {

    try {
        const userId = req.userId;
        const meetingId = req.params.meetingId;
        const data = req.body;

        console.log(data);

        const participantData = {
            ...data,
            userId,
            meetingId,
            participantId: uuid(),
        }

        const participant = await createParticipantDB(userId, meetingId, participantData);

        res.status(201).json({
            success: true,
            message: "Participant Created Successfully",
            participant

        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}
export const leaveParticipant = async (req, res) => {

    try {
        const userId = req.userId;
        const meetingId = req.params.meetingId;

        const participant = await leaveParticipantDB(userId, meetingId);

        res.status(201).json({
            success: true,
            message: "Participant Created Successfully",
            participant

        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}


export const getParticipants = async (req, res) => {

    try {
        const userId = req.userId;
        const meetingId = req.params.meetingId;

        const participants = await getParticipantsDB(userId, meetingId);

        res.status(201).json({
            success: true,
            message: "Participant Fetched Successfully",
            participants

        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}

export const getCurrentParticipant = async (req, res) => {

    try {
        const userId = req.userId;
        const meetingId = req.params.meetingId;

        const participants = await getCurrentParticipantDB(userId, meetingId);

        res.status(201).json({
            success: true,
            message: "Participant Fetched Successfully",
            participants

        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }


}






















