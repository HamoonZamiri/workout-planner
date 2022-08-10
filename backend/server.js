import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import {workout_router} from "./routes/workouts.js"
import { user_router } from "./routes/user.js";

//express app
const app = express();

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(`url: ${req.path} method: ${req.method}`);
    next();
})

app.use("/api/workouts", workout_router);
app.use("/api/user", user_router);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            // console.log('listening on port:', process.env.PORT);
            console.log(`listening on port: ${process.env.PORT}`)
        });
    })
    .catch(error => {
        console.log(error);
    })
//server requests
