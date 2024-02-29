import { Request, Response } from "express";

type ResBody<T> = {
  message: string;
  data: T;
};

type ReqUser = {
  userId: string;
  email: string;
};

export type TypeSafeRequest<P, T, Q> = Request<P, {}, T & ReqUser, Q>; // testing out typing request and response
export type TypeSafeResponse<T> = Response<ResBody<T>>;

export type APIResponse<T> = {
  message: string;
  data: T;
};
