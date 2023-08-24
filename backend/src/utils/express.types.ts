import { Request, Response } from "express";
import { User } from "../models/user.model";
import { MongoDocument } from "./mongoose.types";
type ResBody<T> = {
    message: string;
    data: T;
}
type ReqUser = {
    _id: string;
    email: string;
}

export type TypeSafeRequest<T, Q> = Request<{}, {}, T, Q> & {user: ReqUser} ; // testing out typing request and response
export type TypeSafeResponse<T> = Response<ResBody<T>>;
