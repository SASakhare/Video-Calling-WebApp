import express  from "express"
import { get_user } from "../middlewares/auth.middleware.js";
import {getMeetingWithPasscode ,createMeeting,getMeetings,getMeeting,updateMeeting,cancelMeeting } from "../controllers/meeting.controller.js";

export const router=express.Router();



// ^ Meeting CRUD


// * create meeting
router.post('/',get_user,createMeeting);


// * get meetings

router.get('/',get_user,getMeetings);



//* get specific meeting with meeting id

router.get('/:meetingId',get_user,getMeeting)

router.get('/:meetingId/passcode/:passcode',get_user,getMeetingWithPasscode)

// * update meeting with meeting id

router.patch('/:meetingId',get_user,updateMeeting)


// * Cancel meeting with meeting id

router.delete('/:meetingId/cancel',get_user,cancelMeeting)

// * update status with meeting id





















