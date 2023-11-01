import { NextFunction, Request } from "express";
import { TypeSafeRequest, TypeSafeResponse } from "../../utils/express.types";
import { Routine } from "../entities/routine.entity";
import RoutineService from "../services/routine.service";
import { zParse } from "../../utils/zod";
import { CreateRoutineRequest } from "../routine.types";

const postRoutineHandler = async (req: Request, res: TypeSafeResponse<Routine>, next: NextFunction) => {
    try {
        const { body, params } = await zParse(CreateRoutineRequest, req);
        const title = body.title, description = body.description, userId = params.userId, timeToComplete = body.timeToComplete;
        const routine = await RoutineService.createRoutine(title, description, userId, timeToComplete);
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