import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import WorkoutService from "../../workout/services/workout.service";
import { Routine } from "../entities/routine.entity";

const RoutineRepository = FitlogCoreDataSource.getRepository(Routine);

const createRoutine = async (title: string, description: string, userId: string) => {
    const routine = RoutineRepository.create({title, description, userId});
    return RoutineRepository.save(routine);
}

const addWorkoutToRoutine = async (routineId: string, workoutId: string) => {
    const workout = await WorkoutService.findWorkoutById(workoutId);
    const routine = await RoutineRepository.findOne({
        where: {
            id: routineId
        },
        relations: {workouts: true}
    });
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    if (routine.workouts) {
        routine.workouts.push(workout);
    } else {
        routine.workouts = [workout];
    }
    return routine.save({reload: true});
};

const findRoutineById = async (routineId: string) => {
    const routine = await RoutineRepository.findOneBy({id: routineId});
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    return routine;
}

const findUserRoutines = async (userId: string) => {
    return RoutineRepository.findBy({userId});
};

const findRoutineByTitle = async (title: string) => {
    const routine = await RoutineRepository.findOneBy({title});
    if (!routine) {
        throw new Error("Routine was not found!");
    }
    return routine;
}

const RoutineService = {
    createRoutine,
    addWorkoutToRoutine,
    findRoutineById,
    findUserRoutines,
    findRoutineByTitle,
};
export default RoutineService;