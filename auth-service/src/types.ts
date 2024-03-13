import { Response } from "express";
export type UserLoginDTO = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export type ResponseBody<T> = {
  message: string;
  data: T;
};

export type APIResponse<T> = Response<ResponseBody<T>>;
