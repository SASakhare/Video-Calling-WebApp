import express from "express";
import { createServer } from "http"

import { router as AuthRouter } from "./routes/auth.routes.js";
import { router as UserRouter } from "./routes/user.routes.js";
import { router as MeetingRouter } from "./routes/meetings.routes.js"

import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
// * remove while deploying
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { initializeSocket, getIO } from "./socket/index.js"
import { registerSocketEvents } from "./socket/register.js";

// * media-soup
import WorkerService from "./media/services/WorkerService.js"


dotenv.config();
WorkerService.initialize()





const app = express();
const httpServer = createServer(app);

const io = initializeSocket(httpServer);
registerSocketEvents(io);

const PORT = 8000;
await connectDB();


app.use(morgan("dev"))
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
}))
app.use(express.json()); // * to parse json data 
app.use(cookieParser())



app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/meetings", MeetingRouter)

app.get('/', (req, res) => {
    res.send('Hello World');
})


httpServer.listen(PORT, () => {
    console.log(`server running at : http://localhost:${PORT}`);

})



















