import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {email, password} )
        });
        const json = await res.json();
        if(!res.ok){
            setIsLoading(false);
            setError(json.error);
        }
        if(res.ok){
            setIsLoading(false);
            //save the jwt, email in local storage
            localStorage.setItem("user", JSON.stringify(json));

            //update the auth context
            dispatch({type: "LOGIN", payload: json});
        }
    }
    return { signup, error, isLoading };
}