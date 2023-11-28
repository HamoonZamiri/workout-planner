import { z } from "zod";

const WorkoutIdParamSchema = z.object({
	id: z.string().uuid(),
});

export const GetWorkoutByIdRequest = z.object({
	params: WorkoutIdParamSchema,
});

export const CreateWorkoutSchema = z.object({
	title: z.string(),
	load: z.number(),
	reps: z.number(),
	sets: z.number(),
	routineId: z.string().uuid(),
});

export const CreateWorkoutRequest = z.object({
	body: CreateWorkoutSchema,
});

export type CreateWorkoutData = z.infer<typeof CreateWorkoutRequest>["body"] & {
	userId: string;
};

export const UpdateWorkoutRequest = z.object({
	params: WorkoutIdParamSchema,
	body: CreateWorkoutSchema.omit({ routineId: true }).partial(),
});

export type UpdateWorkoutFields = z.infer<typeof UpdateWorkoutRequest>["body"];
