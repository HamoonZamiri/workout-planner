import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Workout } from "../entities/workout.entity";
import RoutineService from "../../routine/services/routine.service";
import { CreateWorkoutData, UpdateWorkoutFields } from "../workout.types";
import { DeleteResult } from "typeorm";

const WorkoutRepository = FitlogCoreDataSource.getRepository(Workout);

const getAll = async (): Promise<Workout[]> => {
	return WorkoutRepository.find();
};

const getMine = async (userId: string): Promise<Workout[]> => {
	return WorkoutRepository.findBy({ userId });
};

const post = async (data: CreateWorkoutData): Promise<Workout> => {
	const workout = WorkoutRepository.create(data);

	let routine = await RoutineService.getById(data.routineId);

	if (!routine) {
		routine = await RoutineService.getByTitle("Default");
	}

	workout.routine = routine;
	return WorkoutRepository.save(workout);
};

const minMaxConstraint = (workoutUpdate: UpdateWorkoutFields, workout: Workout): boolean => {

	if (workoutUpdate.setsLow && workoutUpdate.setsHigh && workoutUpdate.setsLow > workoutUpdate.setsHigh) {
		return false;
	}

	if (workoutUpdate.setsLow && workoutUpdate.setsLow > workout.setsHigh) {
		return false;
	}

	if (workoutUpdate.setsHigh && workoutUpdate.setsHigh < workout.setsLow) {
		return false;
	}

	if (workoutUpdate.repsLow && workoutUpdate.repsHigh && workoutUpdate.repsLow > workoutUpdate.repsHigh) {
		return false;
	}

	if (workoutUpdate.repsLow && workoutUpdate.repsLow > workout.repsHigh) {
		return false;
	}

	if (workoutUpdate.repsHigh && workoutUpdate.repsHigh < workout.repsLow) {
		return false;
	}
	return true;
}

const put = async (
	userId: string,
	workoutId: string,
	workoutUpdate: UpdateWorkoutFields
): Promise<Workout> => {
	let workout = await WorkoutRepository.findOneBy({ id: workoutId });
	if (!workout) {
		throw new Error("Workout was not found");
	}

	if (workout.userId !== userId) {
		throw new Error("Workout does not belong to you");
	}

	if (!minMaxConstraint(workoutUpdate, workout)) {
		throw new Error("Sets min and Reps min must be lower than respective max values!");
	}

	workout = { ...workout, ...workoutUpdate } as Workout;
	return WorkoutRepository.save(workout);
};

const patchRoutine = async (
	userId: string,
	workoutId: string,
	routineId: string
): Promise<Workout> => {
	let workout = await WorkoutRepository.findOneBy({ id: workoutId });
	if (!workout) {
		throw new Error("Workout was not found");
	}
	if (workout.userId !== userId) {
		throw new Error("Workout does not belong to this user");
	}
	const routine = await RoutineService.getById(routineId);
	workout.routine = routine;
	return WorkoutRepository.save(workout);
};

const _delete = async (userId: string, workoutId: string): Promise<DeleteResult> => {
	const workout = await WorkoutRepository.findOneBy({ id: workoutId });
	if (!workout) {
		throw new Error("Workout was not found!");
	}
	if (workout.userId !== userId) {
		throw new Error("User does not own this workout");
	}
	const deleted = await WorkoutRepository.delete({ id: workoutId });
	if (!deleted) {
		throw new Error(
			"Something went wrong while trying to delete the workout!"
		);
	}
	return deleted;
};

const getById = async (workoutId: string): Promise<Workout> => {
	const workout = await WorkoutRepository.findOne({
		where: {
			id: workoutId,
		},
		relations: { routine: true },
	});

	if (!workout) {
		throw new Error("Workout was not found!");
	}
	return workout;
};

const WorkoutService = {
	getAll,
	getMine,
	getById,
	post,
	put,
	_delete,
	patchRoutine,
};

export default WorkoutService;
