import express from "express";
import { router as AuthRouter } from "./routes/auth.routes.js";
import {router as UserRouter} from "./routes/user.routes.js";
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
// * remove while deploying
import morgan from "morgan"
import cookieParser from "cookie-parser"

dotenv.config();





const app = express();
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

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.listen(PORT, () => {
    console.log(`server running at : http://localhost:${PORT}`);

})



















