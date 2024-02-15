import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { zodParse } from "../utils/zodParser";
import AuthService from "../service/authUser.service";
import AppError from "../utils/AppError";

const LoginRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const SignupRequestSchema = LoginRequestSchema;

type UserLoginDTO = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

type ResponseBody<T> = {
  message: string;
  data: T;
};

type APIResponse<T> = Response<ResponseBody<T>>;

async function login(
  req: Request,
  res: APIResponse<UserLoginDTO>,
  next: NextFunction,
) {
  try {
    const { body } = await zodParse(LoginRequestSchema, req);
    const loginInfo = await AuthService.login(body.email, body.password);
    res.status(200).json({
      message: "User logged in successfully",
      data: {
        accessToken: loginInfo.accessToken,
        id: loginInfo.user.id,
        email: loginInfo.user.email,
        refreshToken: loginInfo.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function signup(
  req: Request,
  res: APIResponse<UserLoginDTO>,
  next: NextFunction,
) {
  try {
    const { body } = await zodParse(SignupRequestSchema, req);
    const loginInfo = await AuthService.signup(body.email, body.password);
    res.status(201).json({
      message: "User created successfully",
      data: {
        accessToken: loginInfo.accessToken,
        id: loginInfo.user.id,
        email: loginInfo.user.email,
        refreshToken: loginInfo.refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

const RefreshRequestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    refreshToken: z.string(),
  }),
});

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

async function refresh(
  req: Request,
  res: APIResponse<RefreshResponse>,
  next: NextFunction,
) {
  try {
    const { params, body } = await zodParse(RefreshRequestSchema, req);
    const { refreshToken, accessToken } = await AuthService.refresh(
      body.refreshToken,
      params.id,
    );
    res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        refreshToken,
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

const AuthenticateRequestSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  headers: z.object({
    authorization: z.string(),
  }),
});

type AuthenticateResponse = {
  valid: boolean;
};

async function authenticate(
  req: Request,
  res: APIResponse<AuthenticateResponse>,
  next: NextFunction,
) {
  try {
    const { params, headers } = await zodParse(AuthenticateRequestSchema, req);
    const token = headers.authorization.split(" ")[1];
    const userId = AuthService.authenticate(token || "");
    if (userId !== params.id) {
      throw new AppError(
        401,
        "Invalid token user is accessing another user's data",
      );
    }

    res.status(200).json({
      message: "Token authenticated successfully",
      data: {
        valid: true,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await AuthService.getAllUsers();
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

const AuthController = {
  login,
  signup,
  refresh,
  authenticate,
  getAllUsers,
};

export default AuthController;
