import { Meeting } from "../models/meeting.models.js";
import { Participant } from "../models/participant.models.js";
import { CustomError } from "../utils/customeError.js";


export const createParticipantDB = async (userId, meetingId, data) => {

    try {

        console.log(data);

        // * checking meeting exist :

        const meeting = await Meeting.findOne({ meetingId })

        if (!meeting) {

            throw CustomError("Requested Meeting Not Found", 400)

        } else if (meeting.status == 'CANCELLED') {

            throw CustomError("Requested Meeting CANCELLED", 400)
        } else if (meeting.status == 'ENDED') {

            throw CustomError("Requested Meeting ENDED", 400)
        }

        const existParticipant = await Participant.findOne({ meetingId, userId })

        if (existParticipant) {
            // throw CustomError("User already participated in the meeting", 400)
            return existParticipant;
        }

        const participant = await Participant.create(data);

        if (!participant) {
            throw new CustomError("Error while  Participant creating", 503);
        }

        return participant;

    } catch (error) {

        console.error("ERROR -Participant Creation Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participant creating", 503);
    }

}

export const leaveParticipantDB = async (userId, meetingId) => {

    try {


        // * checking meeting exist :

        const meeting = await Meeting.findOne({ meetingId })

        if (!meeting) {

            throw CustomError("Requested Meeting Not Found", 400)

        } else if (meeting.status == 'CANCELLED') {

            throw CustomError("Requested Meeting CANCELLED", 400)

        } else if (meeting.status == 'ENDED') {

            throw CustomError("Requested Meeting ENDED", 400)
        }


        const participant = await Participant.findOneAndUpdate(
            { userId, meetingId },
            { status: "LEFT", leftAt: Date.now() },
            {
                new: true,
                runValidators: true
            });

        if (!participant) {
            throw new CustomError("Error while  Participant Leave", 503);
        }

        return participant;

    } catch (error) {

        console.error("ERROR -Participant Leaving Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participant Leaving", 503);
    }

}


export const getParticipantsDB = async (userId, meetingId) => {

    try {


        // * checking meeting exist :

        const meeting = await Meeting.findOne({ meetingId })

        if (!meeting) {

            throw new CustomError("Requested Meeting Not Found", 400)

        } else if (meeting.status == 'CANCELLED') {

            throw new CustomError("Requested Meeting CANCELLED", 400)

        } else if (meeting.status == 'ENDED') {

            throw new CustomError("Requested Meeting ENDED", 400)
        }


        const participants = await Participant.find({ meetingId });

        // if (!participants) {
        //     throw new CustomError("Error while  Participants Fetching", 503);
        // }

        return participants;

    } catch (error) {

        console.error("ERROR -Participants Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participants Fetching", 503);
    }

}

export const getParticipantDB = async (hostId,meetingId) => {

    try {

        const participant = await Participant.findOne({ hostId,meetingId });

        // if (!participants) {
        //     throw new CustomError("Error while  Participants Fetching", 503);
        // }

        return participant;

    } catch (error) {

        console.error("ERROR -Participants Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participants Fetching", 503);
    }

}


export const getCurrentParticipantDB = async (userId, meetingId) => {

    try {


        // * checking meeting exist :

        const meeting = await Meeting.findOne({ meetingId, hostId: userId })

        if (!meeting) {

            throw CustomError("Requested Meeting Not Found", 400)

        } else if (meeting.status == 'CANCELLED') {

            throw CustomError("Requested Meeting CANCELLED", 400)

        } else if (meeting.status == 'ENDED') {

            throw CustomError("Requested Meeting ENDED", 400)
        }


        const participants = await Participant.findOne({ meetingId, userId });

        if (!participants) {
            throw new CustomError("Error while  Participant Fetching", 503);
        }

        return participants;

    } catch (error) {

        console.error("ERROR -Participant Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participant Fetching", 503);
    }

}

export const updateParticipantDB = async (participantId, data) => {

    try {


        // * checking meeting exist :


        const participants = await Participant.findOneAndUpdate({ participantId }, data, {
            new: true,
            runValidators: true,

        });

        console.log(participants);

        return participants;

    } catch (error) {

        console.error("ERROR -Participant Fetching Failure:", error.message);

        if (error instanceof CustomError || error.statusCode) {
            throw error;

        }
        throw new CustomError("Error while Participant Fetching", 503);
    }

}


































