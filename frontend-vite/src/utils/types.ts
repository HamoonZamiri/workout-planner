import { z } from "zod";

export type User = {
	id: string;
	email: string;
	token: string;
};

export type WorkoutFormData = {
	title: string;
	load: string;
	repsLow: string;
	repsHigh: string;
	setsLow: string;
	setsHigh: string;
};

export const initialFormData: WorkoutFormData = {
	title: "",
	load: "0",
	repsLow: "8",
	repsHigh: "12",
	setsLow: "1",
	setsHigh: "3",
};

export type ServerResponse<T> = {
	message: string;
	data: T;
	error?: string;
	emptyFields?: string[];
};
const validFormNumber = z
	.string()
	.transform((val) => Number(val))
	.refine((val) => !isNaN(val) && val >= 1, {
		message: "Reps and Sets must be a number and at least 1",
	});

export const WorkoutFormSchema = z.object({
	title: z.string(),
	repsLow: validFormNumber,
	repsHigh: validFormNumber,
	setsLow: validFormNumber,
	setsHigh: validFormNumber,
	load: z
		.string()
		.transform((val) => Number(val))
		.refine((val) => !isNaN(val) && val >= 0, {
			message: "Load must be a number and at least 0",
		}),
});

const WorkoutSchema = WorkoutFormSchema.extend({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	routineId: z.string().uuid(),
	mainWorkout: z.string().uuid(),
	weightType: z.enum(["lbs", "kg"]),
});

export type Workout = z.infer<typeof WorkoutSchema>;

export const RoutineSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	title: z.string(),
	description: z.string(),
	userId: z.string().uuid(),
	timeToComplete: z.number().min(1).max(240),
	workouts: z.array(WorkoutSchema),
});

export type Routine = z.infer<typeof RoutineSchema>;
