import { createContext, useEffect, useReducer } from "react";
import { User } from "../utils/types";

type AuthContextType = {
	user: User | null;
};

type ACTIONTYPE =
	| { type: "LOGIN"; payload: User }
	| { type: "LOGOUT"; payload: null };

const initalState = { user: null };
export const AuthContext = createContext<{
	state: AuthContextType;
	dispatch: React.Dispatch<ACTIONTYPE>;
}>({ state: initalState, dispatch: () => null });

const authReducer = (prevState: AuthContextType, action: ACTIONTYPE) => {
	switch (action.type) {
		case "LOGIN":
			return { user: action.payload };
		case "LOGOUT":
			return { user: null };
		default:
			return prevState;
	}
};

const AuthContextProvider = ({ children }: {children: JSX.Element}) => {
	const [state, dispatch] = useReducer(authReducer, { user: null });
	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user !== null) {
			const parsedUser: User = JSON.parse(user);
			dispatch({ type: "LOGIN", payload: parsedUser });
		}
	}, []);
	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;