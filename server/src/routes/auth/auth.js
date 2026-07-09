import express from "express"
import { login, logout, register ,updateMe} from "../../controllers/auth.js"
import { get_user } from "../../middlewares/auth.middlewares.js"

export const router = express.Router()



// * login :


router.post('/login', login)


// * register 

router.post('/register', register)



// * logout

router.get('/logout',logout);


// * update-user


router.post('/update-user',get_user,updateMe)












