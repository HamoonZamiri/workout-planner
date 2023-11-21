import { z } from "zod";

export const LoginRequestDTO = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const SignupRequestDTO = LoginRequestDTO;

export const GetByIdRequestDTO = z.object({
    params: z.object({
        userId: z.string().uuid(),
    }),
});

export type UserLoginDTO = {
    id: string;
    email: string;
    token: string;
};

export type UserDTO = {
    id: string;
    email: string;
};