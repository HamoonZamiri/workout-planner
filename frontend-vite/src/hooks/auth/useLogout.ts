import { useCookies } from "react-cookie";
import { useAuthContext } from "../context/useAuthContext";
import useRoutinesContext from "../context/useRoutinesContext";
import { useWorkoutsContext } from "../context/useWorkoutsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();
  const routineDispatch = useRoutinesContext().dispatch;
  const removeCookie = useCookies(["user"])[2];

  const logout = () => {
    removeCookie("user", { path: "/" });
    dispatch({ type: "LOGOUT", payload: null });
    routineDispatch({ type: "SET_ROUTINES", payload: [] });
    workoutsDispatch({ type: "SET_WORKOUTS", payload: [] });
  };

  return { logout };
};
