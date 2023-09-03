import { mongoose } from "@typegoose/typegoose";
import { Workout, WorkoutModel } from "../models/workout.model"

type PartialWorkout = Partial<{title: string, load: number, reps: number}>;
const findWorkouts = async() => {
return WorkoutModel.find();
}

const findUserWorkouts = async(user_id: string) => {
    return WorkoutModel.find({user_id});
};

const createWorkout = async(title: string, reps: number, load: number, user_id: string) => {
    return WorkoutModel.create({title, reps, load, user_id});
}

const updateWorkout = async (userId: string, workoutId: string, workoutUpdate: PartialWorkout) => {
    let workout = await WorkoutModel.findById(workoutId);
    if (!workout) {
        throw new Error("Workout was not found");
    }
    if (workout.user_id !== userId) {
        console.log(workout.user_id, userId);
        throw new Error("Workout does not belong to this user");
    }
    if (workoutUpdate.title) {
        workout.title = workoutUpdate.title;
    }
    if (workoutUpdate.reps) {
        workout.reps = workoutUpdate.reps;
    }
    if (workoutUpdate.load) {
        workout.load = workoutUpdate.load;
    }
    const updated = await WorkoutModel.findByIdAndUpdate({_id: workoutId}, workout, {new: true});
    if (!updated) {
        throw new Error("Something went wrong while trying to update the workout!");
    }
    return updated;
}

const deleteWorkout = async (userId: string, workoutId: string) => {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) {
        throw new Error("Workout was not found!");
    }
    if (workout.user_id !== userId) {
        throw new Error("User does not own this workout");
    }
    const deleted = await WorkoutModel.findByIdAndDelete(workoutId);
    if (!deleted) {
        throw new Error("Something went wrong while trying to delete the workout!");
    }
    return deleted;
}

const findWorkoutById = async (workoutId: string) => {
    const workout = await WorkoutModel.findById(workoutId);
    if (!workout) {
        throw new Error("Workout was not found!");
    }
    return workout;
}
const WorkoutService = {
    findWorkouts,
    findUserWorkouts,
    findWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
}

export default WorkoutService;