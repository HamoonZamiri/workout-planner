import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import constants from "../../utils/constants";
import { createServerResponseSchema } from "../../utils/types";
import { useCookies } from "react-cookie";
import { z } from "zod";

const LoginSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  email: z.string(),
  id: z.string(),
});

const LoginResponseSchema = createServerResponseSchema(LoginSchema);

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setCookie = useCookies(["user"])[1];
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch(constants.api_base + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    const parsedJson = LoginResponseSchema.parse(json);

    if (!res.ok && parsedJson.error) {
      setIsLoading(false);
      setError(parsedJson.error);
    } else {
      setIsLoading(false);
      setCookie("user", parsedJson.data, { path: "/" });
      dispatch({ type: "LOGIN", payload: parsedJson.data });
    }
  };

  return { login, error, isLoading };
};
