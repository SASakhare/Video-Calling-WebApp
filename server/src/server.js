import express from "express";
import { router as AuthRouter } from "./routes/auth/auth.js";
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
// * remove while deploying
import morgan from "morgan"
import cookieParser from "cookie-parser"


dotenv.config();

// console.log(process.env.MONGODB_URL);
// console.log(process.env.CLIENT_URL);



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

app.get('/', (req, res) => {
    res.send('Hello World');
})


app.listen(PORT, () => {
    console.log(`server running at : http://localhost:${PORT}`);

})



















