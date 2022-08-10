import express, { Router } from "express";
import {workout_schema} from "../models/workoutModel.js"
export const workout_router = express.Router();
import {createWorkout, getWorkout, getWorkouts, deleteWorkout, updateWorkout} from "../controllers/workout_controller.js"
import { requireAuth } from "../middleware/requireAuth.js";

//Authorize user
workout_router.use(requireAuth);
//GET all workouts
workout_router.get("/", getWorkouts)

//GET a single workout by id
workout_router.get("/:id", getWorkout)

//POST a new workout

workout_router.post("/", createWorkout)

//DELETE a workout
workout_router.delete("/:id", deleteWorkout)

// UPDATE a workout
workout_router.patch("/:id", updateWorkout)