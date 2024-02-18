import { z } from "zod";
const UserMiddleware = z.object({
  userId: z.string().uuid(),
});

const CreateRoutineSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5).max(200),
  timeToComplete: z.number().min(1).int(),
});

export const CreateRoutineRequest = z.object({
  body: CreateRoutineSchema.merge(UserMiddleware),
});

export const GetRoutinesRequest = z.object({
  params: UserMiddleware,
});

export const idRequest = z.object({
  params: z.object({
    userId: z.string().uuid(),
    routineId: z.string().uuid(),
  }),
});

export const UpdateRoutineRequest = z.object({
  params: z.object({
    routineId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
  body: CreateRoutineSchema.partial(),
});

export type RoutineUpdateFields = z.infer<typeof UpdateRoutineRequest>["body"];
