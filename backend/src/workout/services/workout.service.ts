import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Workout } from "../entities/workout.entity";
import RoutineService from "../../routine/services/routine.service";
import { CreateWorkoutData, UpdateWorkoutFields } from "../workout.types";

const WorkoutRepository = FitlogCoreDataSource.getRepository(Workout);

const getAll = async () => {
	return WorkoutRepository.find();
};

const getMine = async (userId: string) => {
	return WorkoutRepository.findBy({ userId });
};

const post = async (data: CreateWorkoutData) => {
	const workout = WorkoutRepository.create(data);

	let routine = await RoutineService.getById(data.routineId);

	if (!routine) {
		routine = await RoutineService.getByTitle("Default");
	}

	workout.routine = routine;
	return WorkoutRepository.save(workout);
};

const put = async (
	userId: string,
	workoutId: string,
	workoutUpdate: UpdateWorkoutFields
) => {
	let workout = await WorkoutRepository.findOneBy({ id: workoutId });
	if (!workout) {
		throw new Error("Workout was not found");
	}
	if (workout.userId !== userId) {
		throw new Error("Workout does not to you");
	}
	workout = { ...workout, ...workoutUpdate } as Workout;
	return WorkoutRepository.save(workout);
};

const patchRoutine = async (
	userId: string,
	workoutId: string,
	routineId: string
) => {
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

const _delete = async (userId: string, workoutId: string) => {
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

const getById = async (workoutId: string) => {
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
