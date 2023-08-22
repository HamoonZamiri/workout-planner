import { NextFunction } from "express";
import { TypeSafeRequest, TypeSafeResponse } from "../utils/express.types";
import { createWorkout, findUserWorkouts, findWorkouts } from "../services/workout.service";
import { Workout } from "../models/workout.model";
import mongoose, { Document } from "mongoose";
import { BeAnObject, IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";
import { MongoDocument } from "../utils/mongoose.types";
import { getEmptyFields } from "../utils/emptyfields";

// type
type CreateWorkoutRequestBody = {
    title: string;
    load: number;
    reps: number;
};

export const handleGetWorkouts = async(req: TypeSafeRequest<{}, {user_id: string}>, res: TypeSafeResponse<MongoDocument<Workout>[]>, next: NextFunction) => {
    try {
        const {user_id} = req.query;
        let workouts: MongoDocument<Workout>[];
        if(!user_id) {
            workouts = await findWorkouts();
        }
        else {
            workouts = await findUserWorkouts(user_id);
        }
        res.status(200).json({message: "Workouts found successfully", data: workouts})
    } catch (err) {
        next(err);
    }
};

export const createWorkoutHandler = async(req: TypeSafeRequest<CreateWorkoutRequestBody, {}>, res: TypeSafeResponse<MongoDocument<Workout>>, next: NextFunction) => {
    try {
        const {title, load, reps} = req.body;
        const emptyFields = getEmptyFields(req.body, ["title", "load", "reps"]);
        if(emptyFields.length > 0) {
            throw new Error(`Missing fields: ${emptyFields.join(", ")}`);
        }
        const user_id = req.user._id;
        const workout = await createWorkout(title, load, reps, user_id.toString());
    } catch (err) {
        next(err);
    }
}