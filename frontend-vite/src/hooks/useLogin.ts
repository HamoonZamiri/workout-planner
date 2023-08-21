import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { api_base } from "../utils/constants";

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        const res = await fetch(api_base + "/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await res.json();
        if(!res.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        else {
            setIsLoading(false);
            localStorage.setItem("user", JSON.stringify(json));
            dispatch({ type: "LOGIN", payload: json });
        }
    }

    return { login, error, isLoading };
};