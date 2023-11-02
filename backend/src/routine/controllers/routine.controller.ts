import { NextFunction, Request } from "express";
import { TypeSafeResponse } from "../../utils/express.types";
import { Routine } from "../entities/routine.entity";
import RoutineService from "../services/routine.service";
import { zParse } from "../../utils/zod";
import { AddWorkoutToRoutineRequest, CreateRoutineRequest, GetRoutinesRequest } from "../routine.types";

const postRoutineHandler = async (req: Request, res: TypeSafeResponse<Routine>, next: NextFunction) => {
    try {
        const { body } = await zParse(CreateRoutineRequest, req);
        const title = body.title
        const description = body.description
        const userId = body.userId, timeToComplete = body.timeToComplete;
        const routine = await RoutineService.createRoutine(title, description, userId, timeToComplete);
        res.status(200).json({ message: "Routine created successfully", data: routine });
    } catch (err) {
        next(err);
    }
}

const getUserRoutinesHandler = async (req: Request, res: TypeSafeResponse<Routine[]>, next: NextFunction) => {
    try {
        const { body } = await zParse(GetRoutinesRequest, req);
        const routines = await RoutineService.findUserRoutines(body.userId);
        res.status(200).json({ message: "Routines found successfully", data: routines });
    } catch (err) {
        next(err);
    }
};

const addWorkoutToRoutineHandler = async (req: Request, res: TypeSafeResponse<Routine>, next: NextFunction) => {
    try {
        const { params } = await zParse(AddWorkoutToRoutineRequest, req);
        const routine = await
            RoutineService.addWorkoutToRoutine(params.routineId,
                params.workoutId);
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