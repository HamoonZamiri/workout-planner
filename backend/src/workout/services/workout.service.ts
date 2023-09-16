import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Workout } from "../entities/workout.entity";
import RoutineService from "../../routine/services/routine.service";

const WorkoutRepository = FitlogCoreDataSource.getRepository(Workout);
type PartialWorkout = Partial<Workout>;
const findWorkouts = async() => {
    return WorkoutRepository.find();
}

const findUserWorkouts = async(userId: string) => {
    return WorkoutRepository.findBy({userId});
};

const createWorkout = async(title: string, reps: number, load: number, sets: number, userId: string, routineId: string) => {
    const workout = WorkoutRepository.create({title, reps, load, sets, userId});
    let routine = await RoutineService.findRoutineById(routineId);
    if (!routine) {
        routine = await RoutineService.findRoutineByTitle("Default");
    }
    workout.routine = routine;
    return WorkoutRepository.save(workout);
}

const updateWorkout = async (userId: string, workoutId: string, workoutUpdate: PartialWorkout) => {
    let workout = await WorkoutRepository.findOneBy({id: workoutId});
    if (!workout) {
        throw new Error("Workout was not found");
    }
    if (workout.userId !== userId) {
        console.log(workout.userId, typeof(userId));
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
    if (workoutUpdate.sets) {
        workout.sets = workoutUpdate.sets;
    }
    return workout.save();
}

const changeRoutineForWorkout = async (userId: string, workoutId: string, routineId: string) => {
    let workout = await WorkoutRepository.findOneBy({id: workoutId});
    if (!workout) {
        throw new Error("Workout was not found");
    }
    if (workout.userId !== userId) {
        throw new Error("Workout does not belong to this user");
    }
    const routine = await RoutineService.findRoutineById(routineId);
    workout.routine = routine;
    return workout.save();
}

const deleteWorkout = async (userId: string, workoutId: string) => {
    const workout = await WorkoutRepository.findOneBy({id: workoutId});
    if (!workout) {
        throw new Error("Workout was not found!");
    }
    if (workout.userId!== userId) {
        throw new Error("User does not own this workout");
    }
    const deleted = await WorkoutRepository.delete({id: workoutId})
    if (!deleted) {
        throw new Error("Something went wrong while trying to delete the workout!");
    }
    return deleted;
};

const findWorkoutById = async (workoutId: string) => {
    const workout = await WorkoutRepository.findOne({
        where: {
            id: workoutId
        },
        relations: {routine: true}
    });

    if (!workout) {
        throw new Error("Workout was not found!");
    }
    return workout;
};

const WorkoutService = {
    findWorkouts,
    findUserWorkouts,
    findWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    changeRoutineForWorkout,
}

export default WorkoutService;