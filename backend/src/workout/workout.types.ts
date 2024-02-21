import { z } from "zod";

export const UserMiddlewareSchema = z.object({
  "user-id": z.string().uuid(),
});

export const GetMyWorkoutsRequestSchema = z.object({
  headers: UserMiddlewareSchema,
});

const IdSchema = z.object({
  id: z.string().uuid(),
});

export const GetWorkoutByIdRequest = z.object({
  headers: UserMiddlewareSchema,
  params: IdSchema,
});

export const CreateWorkoutSchema = z
  .object({
    title: z.string(),
    load: z.number().min(0),
    repsLow: z.number().min(1).optional().default(4),
    repsHigh: z.number().min(1).optional().default(12),
    setsLow: z.number().min(1).optional().default(1),
    setsHigh: z.number().min(1).optional().default(3),
    routineId: z.string().uuid(),
  })
  .refine(
    (data) => data.repsLow <= data.repsHigh && data.setsLow <= data.setsHigh,
    {
      message:
        "Sets min and Reps min must be lower than respective max values!",
    },
  );

export const CreateWorkoutRequest = z.object({
  headers: UserMiddlewareSchema,
  body: CreateWorkoutSchema,
});

export type CreateWorkoutData = z.infer<typeof CreateWorkoutRequest>["body"];

export const UpdateWorkoutRequest = z.object({
  headers: UserMiddlewareSchema,
  params: IdSchema,
  body: CreateWorkoutSchema.innerType().partial(),
});

export type UpdateWorkoutFields = z.infer<typeof UpdateWorkoutRequest>["body"];
