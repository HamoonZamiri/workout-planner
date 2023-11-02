import { NextFunction, Request } from "express";
import { TypeSafeRequest, TypeSafeResponse } from "../../utils/express.types";
import WorkoutService from "../services/workout.service";
import { getEmptyFields } from "../../utils/emptyfields";
import { Workout } from "../entities/workout.entity";
import { DeleteResult } from "typeorm";

// type
type CreateWorkoutRequestBody = {
    title: string;
    load: number;
    reps: number;
    sets: number;
    routineId: string;
};

type UpdateWorkoutRequestBody = {
    _id: string;
    title?: string;
    load?: number;
    reps?: number;
    sets?: number;
};

const getAllWorkoutsHandler = async (_: Request, res: TypeSafeResponse<Workout[]>, next: NextFunction) => {
    try {
        const workouts = await WorkoutService.findWorkouts();
        res.status(200).json({ message: "Workouts found successfully", data: workouts })
    } catch (err) {
        next(err);
    }
};

const getWorkoutsByUserIdHandler = async (req: TypeSafeRequest<{}, {}, {}>, res: TypeSafeResponse<Workout[]>, next: NextFunction) => {
    try {
        const workouts = await WorkoutService.findUserWorkouts(req.body.userId);
        res.status(200).json({ message: "Workouts found successfully", data: workouts })
    } catch (err) {
        next(err);
    }
};

const getWorkoutByIdHandler = async (req: TypeSafeRequest<{id: string}, {}, {}>, res: TypeSafeResponse<Workout>, next: NextFunction) => {
    try {
        const workout = await WorkoutService.findWorkoutById(req.params.id);
        res.status(200).json({ message: "Workout found successfully", data: workout })
    } catch (err) {
        next(err);
    }
};
const createWorkoutHandler =
    async (
        req: TypeSafeRequest<{}, CreateWorkoutRequestBody, {}>,
        res: TypeSafeResponse<Workout>,
        next: NextFunction) => {
        try {
            const { title, load, sets, reps, routineId } = req.body;
            const emptyFields = getEmptyFields(req.body, ["title", "load", "reps", "sets"]);
            if (emptyFields.length > 0) {
                throw new Error(`Missing fields: ${emptyFields.join(", ")}`);
            }
            const workout = await WorkoutService.createWorkout(title, reps, load, sets, req.body.userId, routineId);
            res.status(201).json({ message: "Workout created successfully", data: workout });
        } catch (err) {
            next(err);
        }
    }

const updateWorkoutHandler = async (req: TypeSafeRequest<{id: string}, UpdateWorkoutRequestBody, {}>,
    res: TypeSafeResponse<Workout>,
    next: NextFunction
    ) => {
    try {
        const workoutId = req.params.id;
        const {title, load, reps, sets } = req.body;
        const updatedWorkout = {_id: workoutId, title, load, reps, sets};
        const successfulUpdate = await WorkoutService.updateWorkout(req.body.userId, workoutId, updatedWorkout);
        if (!successfulUpdate) {
            throw new Error("Something went wrong while trying to update the workout!");
        }
        res.status(200).json({ message: "Workout updated successfully", data: successfulUpdate});
    } catch (err) {
        next(err);
    }
};

const deleteWorkoutHandler = async (req: TypeSafeRequest<{id: string}, {} , {}>, res: TypeSafeResponse<DeleteResult>, next: NextFunction) => {
    try {
        const workoutId = req.params.id;
        const deletedWorkout = await WorkoutService.deleteWorkout(req.body.userId, workoutId);
        if (!deletedWorkout) {
            throw new Error("Something went wrong while trying to delete the workout!");
        }
        res.status(200).json({ message: "Workout deleted successfully", data: deletedWorkout});
    } catch (err) {
        next(err);
    }
};

const WorkoutController = {
    getAllWorkoutsHandler,
    createWorkoutHandler,
    updateWorkoutHandler,
    getWorkoutsByUserIdHandler,
    deleteWorkoutHandler,
    getWorkoutByIdHandler,
}

export default WorkoutController;