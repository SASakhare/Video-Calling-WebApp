import mongoose from "mongoose";


const meetingSchema = new mongoose.Schema({

    meetingId: {
        type: String,
        require: true,
    },
    hostId: {
        type: String,
        require: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    type_: {
        type: String,
        require: true,
        enum: ["INSTANT", "SCHEDULED"],
        default: "INSTANT",
    },
    status: {
        type: String,
        require: true,
        enum: ["CREATED", "WAITING", "LIVE", "ENDED", "CANCELLED"],
        default: 'CREATED',
    },
    meetingPassword: {
        type: String,
    },
    waitingRoomEnabled: {
        type: Boolean,
        require: true,
    },
    participantLimit: {
        type: Number,
        require: [true, 'A participant limit is required'],
        min: [1, "At least 1 participant is required"],
        max: [100, "Participant limit cannot exceed 100"]
    },
    scheduledStartTime: {
        type: Date,
    },
    scheduledEndTime: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!this.scheduledStartTime || !value) {
                    return true; // Allow null/undefined
                }

                return value > this.scheduledStartTime;
            },
            message: "End time must be after the start time."
        }
    },
    actualStartTime: {
        type: Date,
    },
    actualEndTime: {
        type: Date,
    },
    meetingLink: {
        type: String,
        require: true,
    },
},
    {
        timestamps: true,
    })





export const Meeting = mongoose.model("Meeting", meetingSchema)





























