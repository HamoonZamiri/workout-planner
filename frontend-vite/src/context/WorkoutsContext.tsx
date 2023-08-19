import { createContext, useReducer } from "react";
import { Workout } from "../utils/types";
type WorkoutsContextType = {
	workouts: Workout[];
};

type ACTIONTYPE =
	| { type: "SET_WORKOUTS"; payload: Workout[] }
	| { type: "CREATE_WORKOUT"; payload: Workout }
	| { type: "UPDATE_WORKOUT"; payload: Workout }
	| { type: "DELETE_WORKOUT"; payload: Workout };

export const WorkoutsContext = createContext<{
	state: WorkoutsContextType;
	dispatch: React.Dispatch<ACTIONTYPE>;
}>({ state: { workouts: [] }, dispatch: () => null });

const workoutsReducer = (prevState: WorkoutsContextType, action: ACTIONTYPE) => {
    switch (action.type) {
        case "SET_WORKOUTS":
            return {
                workouts: action.payload
            };
        case "CREATE_WORKOUT":
            return {
                workouts: [action.payload, ...prevState.workouts]
            };
        case "DELETE_WORKOUT":
            return {
                workouts: prevState.workouts.filter(w => w._id !== action.payload._id)
            };
        case "UPDATE_WORKOUT":
            return {
                workouts: prevState.workouts.map(w => w._id === action.payload._id ? action.payload : w)
            };
        default:
            return prevState;
    }
};

export const WorkoutsContextProvider = ({ children }: {children: JSX.Element[]}) => {
    const [state, dispatch] = useReducer(workoutsReducer, { workouts: [] });
    return (
        <WorkoutsContext.Provider value={{ state, dispatch }}>
            {children}
        </WorkoutsContext.Provider>
    )
};