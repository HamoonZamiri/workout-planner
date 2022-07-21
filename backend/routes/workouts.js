import express from "express";
import {workout_schema} from "../models/workoutModel.js"
export const router = express.Router();
import {createWorkout, getWorkout, getWorkouts, deleteWorkout, updateWorkout} from "../controllers/workout_controller.js"

//GET all workouts
router.get("/", getWorkouts)

//GET a single workout by id
router.get("/:id", getWorkout)

//POST a new workout

router.post("/", createWorkout)

//DELETE a workout
router.delete("/:id", deleteWorkout)

// UPDATE a workout
router.patch("/:id", updateWorkout)