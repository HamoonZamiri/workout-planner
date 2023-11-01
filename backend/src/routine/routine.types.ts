import { z } from "zod";

const CreateRoutineSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(10).max(200),
    timeToComplete: z.string().transform(val => Number(val)),
})

export const CreateRoutineRequest = z.object({
    body: CreateRoutineSchema,
    params: z.object({
        userId: z.string().uuid()
    })
});