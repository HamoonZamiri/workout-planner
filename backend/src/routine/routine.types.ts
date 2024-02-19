import { z } from "zod";
const UserMiddleware = z.object({
  "x-user-id": z.string().uuid(),
});

const CreateRoutineSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(5).max(200),
  timeToComplete: z.number().min(1).int(),
});

export const CreateRoutineRequest = z.object({
  headers: UserMiddleware,
  body: CreateRoutineSchema,
});

export const GetRoutinesRequest = z.object({
  headers: UserMiddleware,
});

export const idRequest = z.object({
  headers: UserMiddleware,
  params: z.object({
    routineId: z.string().uuid(),
  }),
});

export const UpdateRoutineRequest = z.object({
  headers: UserMiddleware,
  params: z.object({
    routineId: z.string().uuid(),
  }),
  body: CreateRoutineSchema.partial(),
});

export type RoutineUpdateFields = z.infer<typeof UpdateRoutineRequest>["body"];
