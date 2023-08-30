import express, { NextFunction, Request, Response } from "express"
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/user.routes";
import WorkoutRouter from "./routes/workout.routes";
import AppError from "./utils/AppError";
import { mongoose } from "@typegoose/typegoose";
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`url: ${req.path} method: ${req.method}`);
    next();
})

// health check
app.get("/", (req, res) => {
    res.send("Health Check");
});

// routes
app.use("/api/user", UserRouter);
app.use("/api/workout", WorkoutRouter);

// error handling
app.use(
    (error: AppError, req: Request, res: Response, next: NextFunction) => {
        console.log(error.message);
        res.status(error.statuscode ? error.statuscode : 400).json({"error": error.message });
        return;
    }
);

const mongoURL = process.env.MONGO_URI ? process.env.MONGO_URI : "";
mongoose.connect(mongoURL)
.then(() => {
    app.listen(process.env.PORT || 8081, () => {
        console.log("Listening on port " + process.env.PORT || 8081);
    })
});
