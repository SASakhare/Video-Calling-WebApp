import mongoose from "mongoose";
import { env } from "../config/env.js";



export const connectDB = async () => {

    try {

        // * connect to database
        const conn = await mongoose.connect(
            `${env.MONGODB_URL}/${env.MONGODB_DATABASE}`
        )
        console.log(env.MONGODB_DATABASE);

        console.log("Connected DB:", mongoose.connection.name);
        //* ping to database
        await mongoose.connection.db.admin().ping();

        console.log('MongoDB Connected Successfully');

    } catch (error) {
        console.log(`Database Connection Failed :${error.message}`);
        process.exit(1)
    }

}











