import { useAuthContext } from "../context/useAuthContext";
import { useWorkoutsContext } from "../context/useWorkoutsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();

  const logout = () => {
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT", payload: null });
    workoutsDispatch({ type: "SET_WORKOUTS", payload: [] });
  };

  return { logout };
};

