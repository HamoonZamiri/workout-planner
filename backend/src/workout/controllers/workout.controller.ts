import { NextFunction, Request } from "express";
import { TypeSafeResponse } from "../../utils/express.types";
import WorkoutService from "../services/workout.service";
import { getEmptyFields } from "../../utils/emptyfields";
import { Workout } from "../entities/workout.entity";
import { DeleteResult } from "typeorm";
import { zParse } from "../../utils/zod";
import {
	CreateWorkoutRequest,
	GetWorkoutByIdRequest,
	UpdateWorkoutRequest,
} from "../workout.types";

const getAll = async (
	_: Request,
	res: TypeSafeResponse<Workout[]>,
	next: NextFunction
) => {
	try {
		const workouts = await WorkoutService.getAll();
		res.status(200).json({
			message: "Workouts found successfully",
			data: workouts,
		});
	} catch (err) {
		next(err);
	}
};

const getMine = async (
	req: Request,
	res: TypeSafeResponse<Workout[]>,
	next: NextFunction
) => {
	try {
		const workouts = await WorkoutService.getMine(req.body.userId);
		res.status(200).json({
			message: "Workouts found successfully",
			data: workouts,
		});
	} catch (err) {
		next(err);
	}
};

const getById = async (
	req: Request,
	res: TypeSafeResponse<Workout>,
	next: NextFunction
) => {
	try {
		const { params } = await zParse(GetWorkoutByIdRequest, req);
		const workout = await WorkoutService.getById(params.id);
		res.status(200).json({
			message: "Workout found successfully",
			data: workout,
		});
	} catch (err) {
		next(err);
	}
};

const post = async (
	req: Request,
	res: TypeSafeResponse<Workout>,
	next: NextFunction
) => {
	try {
		const parsedRequest = await zParse(CreateWorkoutRequest, req);
		const emptyFields = getEmptyFields(parsedRequest.body, [
			"title",
			"load",
		]);

		if (emptyFields.length > 0) {
			throw new Error(`Missing fields: ${emptyFields.join(", ")}`);
		}

		const workout = await WorkoutService.post({
			...parsedRequest.body,
			userId: req.body.userId,
		});
		res.status(201).json({
			message: "Workout created successfully",
			data: workout,
		});
	} catch (err) {
		next(err);
	}
};

const put = async (
	req: Request,
	res: TypeSafeResponse<Workout>,
	next: NextFunction
) => {
	try {
		const { body, params } = await zParse(UpdateWorkoutRequest, req);
		const updatedWorkout = await WorkoutService.put(
			req.body.userId,
			params.id,
			body
		);

		res.status(200).json({
			message: "Workout updated successfully",
			data: updatedWorkout,
		});
	} catch (err) {
		next(err);
	}
};

const _delete = async (
	req: Request,
	res: TypeSafeResponse<DeleteResult>,
	next: NextFunction
) => {
	try {
		const workoutId = (await zParse(GetWorkoutByIdRequest, req)).params.id;
		const deleteResult = await WorkoutService._delete(
			req.body.userId,
			workoutId
		);

		res.status(200).json({
			message: "Workout deleted successfully",
			data: deleteResult,
		});
	} catch (err) {
		next(err);
	}
};

const WorkoutController = {
	getAll,
	post,
	put,
	getById,
	_delete,
	getMine,
};

export default WorkoutController;