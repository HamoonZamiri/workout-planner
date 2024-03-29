import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import constants from "../../utils/constants";
import { createServerResponseSchema } from "../../schemas/ServerResponse";
import { useCookies } from "react-cookie";
import { z } from "zod";

const SignupSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  email: z.string(),
  id: z.string(),
});

const SignupResponseSchema = createServerResponseSchema(SignupSchema);

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setCookie = useCookies(["user"])[1];
  const { dispatch } = useAuthContext();

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch(constants.api_base + "/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    const parsedJson = SignupResponseSchema.parse(json);

    if (!res.ok) {
      setIsLoading(false);
      setError(parsedJson.error || "");
    } else {
      setIsLoading(false);
      setCookie("user", parsedJson.data, { path: "/" });
      dispatch({ type: "LOGIN", payload: parsedJson.data });
    }
  };
  return { signup, error, setError, isLoading };
};
