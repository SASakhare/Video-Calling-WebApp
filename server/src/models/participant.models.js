import mongoose from "mongoose";



const participantSchema = new mongoose.Schema({
    participantId: {
        type: String,
        require: true,
    },
    meetingId: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
    },
    hostId: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["INVITED", "WAITING", "JOINED", "LEFT", "REMOVED"],
        default: 'INVITED',
    },
    role: {
        type: String,
        require: true,
        enum: ["HOST", "PARTICIPANT"],
    },
    joinedAt: {
        type: Date,
    },
    leftAt: {
        type: Date,
    },
}, {
    timestamps: true,
})







export const Participant = mongoose.model("Participant", participantSchema)



















