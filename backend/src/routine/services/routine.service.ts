import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import WorkoutService from "../../workout/services/workout.service";
import { Routine } from "../entities/routine.entity";

const RoutineRepository = FitlogCoreDataSource.getRepository(Routine);

const createRoutine = async (title: string, description: string, userId: string, timeToComplete: number) => {
    const routine = RoutineRepository.create({ title, description, userId, timeToComplete });
    return RoutineRepository.save(routine);
}

const addWorkoutToRoutine = async (routineId: string, workoutId: string) => {
    const workout = await WorkoutService.findWorkoutById(workoutId);
    const routine = await RoutineRepository.findOne({
        where: {
            id: routineId
        },
        relations: { workouts: true }
    });
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    if (routine.workouts) {
        routine.workouts.push(workout);
    } else {
        routine.workouts = [workout];
    }
    return routine.save({ reload: true });
};

const findRoutineById = async (routineId: string) => {
    const routine = await RoutineRepository.findOneBy({ id: routineId });
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    return routine;
}

const findUserRoutines = async (userId: string) => {
    return RoutineRepository.find(
        {
            where: {
                userId,

            },
            relations: { workouts: true }
        });
};

const findRoutineByTitle = async (title: string) => {
    const routine = await RoutineRepository.findOneBy({ title });
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    return routine;
}

type RoutineUpdateFields = {
    title?: string,
    description?: string,
    timeToComplete?: number,
};

const updateRoutine =
    async (routineId: string, updates: RoutineUpdateFields) => {
        let routine = await RoutineRepository.findOneBy({ id: routineId });
        if (!routine) {
            throw new Error("Routine was not found!");
        }
        routine = { ...routine, ...updates } as Routine;
        return RoutineRepository.save(routine, {reload: true});
    }

const RoutineService = {
    createRoutine,
    addWorkoutToRoutine,
    findRoutineById,
    findUserRoutines,
    findRoutineByTitle,
    updateRoutine
};
export default RoutineService;