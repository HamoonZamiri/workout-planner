import { z } from "zod";

export type Workout = {
    id: string;
    title: string;
    reps: number;
    load: number;
    sets: number;
    userId: string;
}

export type User = {
    id: string,
    email: string;
    token: string;
};
const WorkoutSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    reps: z.number().min(1),
    load: z.number().min(1),
    sets: z.number().min(1),
    userId: z.string().uuid(),
});

export const RoutineSchema = z.object({
    id: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    description: z.string(),
    userId: z.string().uuid(),
    timeToComplete: z.number().min(1).max(240),
    workouts: z.array(WorkoutSchema),
})

export type Routine = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    userId: string;
    timeToComplete: number;
    workouts: Workout[];
}

export type ServerResponse<T> = {
    message: string;
    data: T;
    error?: string;
    emptyFields?: string[];
}
const validFormNumber =
    z.string()
    .refine((val) => val !== "" && !isNaN(Number(val)),
    { message: "Field must be a number!"});

export const WorkoutFormSchema = z.object({
    title: z.string(),
    reps: validFormNumber,
    load: validFormNumber,
    sets: validFormNumber,
})
