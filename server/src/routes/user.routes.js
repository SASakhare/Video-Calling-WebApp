import express from "express"
import { get_user } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/upload.middleware.js"
import { updateAvatar, updateCover } from "../controllers/user.controller.js"
import { updateMe } from "../controllers/user.controller.js"

export const router = express.Router()



// * update-user


router.post('/update-user',get_user,updateMe)



// * avatar image upload
router.patch('/profile/avatar',get_user,upload.single("avatar"),updateAvatar)


// * avatar image upload
router.patch('/profile/cover',get_user,upload.single("cover"),updateCover)









