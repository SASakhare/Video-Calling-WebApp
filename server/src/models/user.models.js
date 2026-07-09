import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    emailVerified: {
        type: Boolean,
        require: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    avatarUrl: {
        type: String,
    },
    coverImageUrl: {
        type: String,
    },
    bio: {
        type: String,
    },
    company: {
        type: String,
        require: true,
    },
    jobTitle: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        default: "INACTIVE"
    },
    lastLoginAt: {
        type: Date
    },
    verificationToken: {
        type: String,
    },
    verificationExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
})




export const User=mongoose.model("User",userSchema);


