import express  from "express"
import { get_user } from "../middlewares/auth.middleware.js";
import { createMeeting } from "../controllers/meeting.controller.js";

export const router=express.Router();



// ^ Meeting CRUD


// * create meeting
router.post('/',get_user,createMeeting);


// * get meetings


//* get specific meeting with meeting id



// * update meeting with meeting id



// * delete meeting with meeting id




















