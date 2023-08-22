import { mongoose } from "@typegoose/typegoose";
import { WorkoutModel } from "../models/workout.model"
mongoose.Types.ObjectId
export const findWorkouts = async() => {
    return WorkoutModel.find();
}

export const findUserWorkouts = async(user_id: string) => {
    return WorkoutModel.find({user_id});
};

export const findWorkoutById = async(id: string) => {
    return WorkoutModel.findById(id);
}

export const createWorkout = async(title: string, reps: number, load: number, user_id: string) => {
    return WorkoutModel.create({title, reps, load, user_id});
}

