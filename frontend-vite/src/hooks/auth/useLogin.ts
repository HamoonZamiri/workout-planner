import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { api_base } from "../../utils/constants";
import { APIResponse } from "../../utils/types";
import { useCookies } from "react-cookie";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  id: string;
};

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["user"]);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    if (cookies.user) {
      return;
    }
    setIsLoading(true);
    setError(null);

    const res = await fetch(api_base + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json()) as APIResponse<LoginResponse>;
    if (!res.ok && json.error) {
      setIsLoading(false);
      setError(json.error);
    } else {
      setIsLoading(false);
      setCookie("user", json.data, { path: "/" });
      dispatch({ type: "LOGIN", payload: json.data });
    }
  };

  return { login, error, isLoading };
};
