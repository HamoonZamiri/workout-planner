import { createContext, useEffect, useReducer } from "react";
import { User } from "../utils/types";
import { useCookies } from "react-cookie";

type AuthContextType = {
  user: User | null;
};

type ACTIONTYPE =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT"; payload: null }
  | { type: "REFRESH"; payload: { accessToken: string; refreshToken: string } };

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
    case "REFRESH":
      return {
        user: {
          ...prevState.user,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        } as User,
      };
    default:
      return prevState;
  }
};

const AuthContextProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [cookie] = useCookies(["user"]);

  useEffect(() => {
    const user = cookie.user as User;
    if (user !== null) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

