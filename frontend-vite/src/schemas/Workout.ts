import { z } from "zod";
import { createFormNumberSchema } from "./Form";

export const WorkoutFormSchema = z.object({
  title: z.string(),
  repsLow: createFormNumberSchema("Reps low must be >= 1 and a number", 1),
  repsHigh: createFormNumberSchema("Reps high must be >= 1 and a number", 1),
  setsLow: createFormNumberSchema("Sets low must be >= 1 and a number", 1),
  setsHigh: createFormNumberSchema("Sets high must be >= 1 and a number", 1),
  load: createFormNumberSchema("Load must be >= 0 and a number", 0),
});

export const WorkoutSchema = z.object({
  title: z.string(),
  repsLow: z.number().min(1),
  repsHigh: z.number().min(1),
  setsLow: z.number().min(1),
  setsHigh: z.number().min(1),
  load: z.number().min(0),
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  weightType: z.enum(["lbs", "kg"]),
});

export type Workout = z.infer<typeof WorkoutSchema>;
