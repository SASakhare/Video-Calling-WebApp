import express from "express"
import { login, logout, register } from "../../controllers/auth.js"


export const router = express.Router()



// * login :


router.post('/login', login)


// * register 

router.post('/register', register)



// * logout

router.get('/logout',logout);















