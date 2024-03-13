import { z } from "zod";
const LoginRequestSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const SignupRequestSchema = LoginRequestSchema;

const schemas = {
  LoginRequestSchema,
  SignupRequestSchema,
} as const;

export default schemas;
