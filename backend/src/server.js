import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();
import {workout_router} from "./routes/workouts.js"
import { user_router } from "./routes/user.js";

//express app
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`url: ${req.path} method: ${req.method}`);
    next();
})

app.use("/api/workouts", workout_router);
app.use("/api/user", user_router);
app.get("/", (req, res) => {
    res.send("Health Check");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            // console.log('listening on port:', process.env.PORT);
            console.log(`listening on port: ${process.env.PORT}`)
        });
    })
    .catch(error => {
        console.log(error);
    })
//server requests
