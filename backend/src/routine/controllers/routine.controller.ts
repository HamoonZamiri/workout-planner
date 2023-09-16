import { NextFunction } from "express";
import { TypeSafeRequest, TypeSafeResponse } from "../../utils/express.types";
import { Routine } from "../entities/routine.entity";
import RoutineService from "../services/routine.service";
type CreateRoutineBody = {
    title: string;
    description: string;
}
const postRoutineHandler = async (req: TypeSafeRequest<{userId: string}, CreateRoutineBody, {}>, res: TypeSafeResponse<Routine>, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const routine = await RoutineService.createRoutine(title, description, req.params.userId);
        res.status(200).json({ message: "Routine created successfully", data: routine });
    } catch(err) {
        next(err);
    }
}

const getUserRoutinesHandler = async(req: TypeSafeRequest<{userId: string}, {}, {}>, res: TypeSafeResponse<Routine[]>, next: NextFunction) => {
    try {
        const routines = await RoutineService.findUserRoutines(req.params.userId);
        res.status(200).json({ message: "Routines found successfully", data: routines });
    } catch(err) {
        next(err);
    }
};

const addWorkoutToRoutineHandler = async(req: TypeSafeRequest<{routineId: string, workoutId: string}, {}, {}>, res: TypeSafeResponse<Routine>, next: NextFunction) => {
    try {
        const routine = await RoutineService.addWorkoutToRoutine(req.params.routineId, req.params.workoutId);
        res.status(200).json({ message: "Workout added to routine successfully", data: routine });
    } catch (err) {
        next(err);
    }
}


const RoutineController = {
    postRoutineHandler,
    getUserRoutinesHandler,
    addWorkoutToRoutineHandler
};
export default RoutineController;