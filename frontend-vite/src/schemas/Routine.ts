import { z } from "zod";
import { WorkoutSchema } from "./Workout";
export const RoutineSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  title: z.string(),
  description: z.string(),
  userId: z.string().uuid(),
  timeToComplete: z.number().min(0).max(240),
  workouts: z.array(WorkoutSchema),
});

export type Routine = z.infer<typeof RoutineSchema>;
