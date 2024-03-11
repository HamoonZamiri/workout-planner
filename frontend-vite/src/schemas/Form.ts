import { z } from "zod";

export function createFormNumberSchema(message: string, min: number) {
  return z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= min, {
      message,
    });
}
