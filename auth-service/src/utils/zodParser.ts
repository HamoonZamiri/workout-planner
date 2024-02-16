import { AnyZodObject, z } from "zod";
import { Request } from "express";
import AppError from "./AppError";

export async function zodParse<T extends AnyZodObject>(
  schema: T,
  req: Request,
): Promise<z.infer<T>> {
  const parsedRequest = await schema.safeParseAsync(req);
  if (!parsedRequest.success) {
    throw new AppError(400, "Missing required field in request");
  }
  return parsedRequest.data;
}
