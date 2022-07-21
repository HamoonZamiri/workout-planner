import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import {router} from "./routes/workouts.js"

//express app
const app = express();

//middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(`url: ${req.path} method: ${req.method}`);
    next();
})

app.use("/api/workouts", router);

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
