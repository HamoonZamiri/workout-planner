import { z } from "zod";
const UserMiddleware = z.object({
    userId: z.string().uuid(),
    email: z.string().email()
});

const CreateRoutineSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(10).max(200),
    timeToComplete: z.string().transform(val => Number(val)),
})

export const CreateRoutineRequest =
    z.object({
        body: CreateRoutineSchema.merge(UserMiddleware)
    });

export const GetRoutinesRequest = z.object({
    body: UserMiddleware,
});

export const AddWorkoutToRoutineRequest = z.object({
    params: z.object({
        routineId: z.string().uuid(),
        workoutId: z.string().uuid()
    })
});