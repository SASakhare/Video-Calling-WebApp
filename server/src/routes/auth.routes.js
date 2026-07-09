import express from "express"
import { login, logout, register } from "../controllers/auth.controller.js"
import { get_user } from "../middlewares/auth.middleware.js"

export const router = express.Router()



// * login :


router.post('/login', login)


// * register 

router.post('/register', register)



// * logout

router.get('/logout',logout);












