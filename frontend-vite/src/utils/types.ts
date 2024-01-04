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

export const createServerResponseSchema = <TData extends z.ZodTypeAny>(
	schema: TData
) => {
	return z.object({
		message: z.string(),
		data: schema,
		error: z.string().optional(),
		emptyFields: z.array(z.string()).optional(),
	});
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

const WorkoutSchema = z.object({
	title: z.string(),
	repsLow: z.number().min(1),
	repsHigh: z.number().min(1),
	setsLow: z.number().min(1),
	setsHigh: z.number().min(1),
	load: z.number().min(0),
	id: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	mainWorkout: z.string().uuid().optional(),
	weightType: z.enum(["lbs", "kg"]),
});

export type Workout = z.infer<typeof WorkoutSchema>;

export const RoutineSchema = z.object({
	id: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	title: z.string(),
	description: z.string(),
	userId: z.string().uuid(),
	timeToComplete: z.number().min(1).max(240),
	workouts: z.array(WorkoutSchema),
});

export type Routine = z.infer<typeof RoutineSchema>;

export const zodFetch = async <TData>(
	url: string,
	schema: z.Schema<TData>,
	options: RequestInit | undefined
): Promise<TData> => {
	const res = await fetch(url, options);
	const json = await res.json();

	if (!res.ok) throw new Error(json.error);

	const data = schema.parse(json);
	return data;
};
