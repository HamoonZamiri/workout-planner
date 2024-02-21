import { useWorkoutsContext } from "./useWorkoutsContext";
import { useAuthContext } from "./useAuthContext"
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: workoutDispatch } = useWorkoutsContext();
    const logout = () => {

        //remove user from local storage
        localStorage.removeItem("user");

        //dispatch logout action to context
        dispatch({type: "LOGOUT"});
        workoutDispatch({type: "SET_WORKOUTS", payload: null});
    }
    return { logout };
}