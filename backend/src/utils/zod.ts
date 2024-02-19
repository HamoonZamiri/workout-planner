import { Request } from "express";
import { z, AnyZodObject } from "zod";
import AppError from "./AppError";

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request,
): Promise<z.infer<T>> {
  const parsedRequest = await schema.safeParseAsync(req);
  if (!parsedRequest.success) {
    const firstIssue = parsedRequest.error.issues[0];
    throw new AppError(400, firstIssue.message + " " + firstIssue.path);
  }
  return parsedRequest.data;
}
