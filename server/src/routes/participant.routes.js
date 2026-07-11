import { router } from "./meetings.routes.js"
import { get_user } from "../middlewares/auth.middleware.js"






// * Join Meeting (Creates Participant)

router.post('/:meetingId/join', get_user, createParticipant)


// * Leave Meeting

router.post('/:meetingId/leave', get_user, leaveParticipant)


// * Get Participants

router.get("/:meetingId/participants", get_user, getParticipants)


// * Get Current Participant

router.get("/:meetingId/me", get_user, getCurrentParticipant)
























