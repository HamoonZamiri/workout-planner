import { z } from "zod";
export const createServerResponseSchema = <TData extends z.ZodTypeAny>(
  schema: TData,
) => {
  return z.object({
    message: z.string(),
    data: schema,
    error: z.string().optional(),
    emptyFields: z.array(z.string()).optional(),
  });
};
