import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { api_base } from "../../utils/constants";
import { APIResponse } from "../../utils/types";
import { useCookies } from "react-cookie";

type SignupResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  id: string;
};

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [cookie, setCookie] = useCookies(["user"]);
  const { dispatch } = useAuthContext();

  const signup = async (email: string, password: string) => {
    if (cookie.user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await fetch(api_base + "/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json()) as APIResponse<SignupResponse>;

    if (!res.ok) {
      setIsLoading(false);
      setError(json.error || "");
    } else {
      setIsLoading(false);
      setCookie("user", json.data, { path: "/" });
      dispatch({ type: "LOGIN", payload: json.data });
    }
  };
  return { signup, error, setError, isLoading };
};
