import { z } from "zod";

const WorkoutIdParamSchema = z.object({
	id: z.string().uuid(),
});

export const GetWorkoutByIdRequest = z.object({
	params: WorkoutIdParamSchema,
});

export const CreateWorkoutSchema = z
	.object({
		title: z.string(),
		load: z.number().min(0),
		repsLow: z.number().min(1),
		repsHigh: z.number().min(1),
		setsLow: z.number().min(1),
		setsHigh: z.number().min(1),
		routineId: z.string().uuid(),
	})
	.refine(
		(data) =>
			data.repsLow <= data.repsHigh && data.setsLow <= data.setsHigh,
		{
			message:
				"Sets min and Reps min must be lower than respective max values!",
		}
	);

export const CreateWorkoutRequest = z.object({
	body: CreateWorkoutSchema,
});

export type CreateWorkoutData = z.infer<typeof CreateWorkoutRequest>["body"] & {
	userId: string;
};

export const UpdateWorkoutRequest = z.object({
	params: WorkoutIdParamSchema,
	body: CreateWorkoutSchema.innerType().partial(),
});

export type UpdateWorkoutFields = z.infer<typeof UpdateWorkoutRequest>["body"];
