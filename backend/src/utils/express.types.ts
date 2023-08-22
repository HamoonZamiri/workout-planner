import { Request, Response } from "express";
import { User } from "../models/user.model";
import { MongoDocument } from "./mongoose.types";
type ResBody<T> = {
    message: string;
    data: T;
}
export type TypeSafeRequest<T, Q> = Request<{}, {}, T, Q> & {user: MongoDocument<Omit<User, "password">>} ; // testing out typing request and response
export type TypeSafeResponse<T> = Response<ResBody<T>>;
