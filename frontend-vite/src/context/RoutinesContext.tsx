import { createContext, useReducer } from "react";
import { Routine } from "../schemas/Routine";
import { Workout } from "../schemas/Workout";
type RoutineContextType = {
  routines: Routine[];
};

type ACTIONTYPE =
  | { type: "SET_ROUTINES"; payload: Routine[] }
  | { type: "CREATE_ROUTINE"; payload: Routine }
  | { type: "UPDATE_ROUTINE"; payload: Routine }
  | { type: "DELETE_ROUTINE"; payload: { routineId: string } }
  | { type: "ADD_WORKOUT"; payload: { routineId: string; workout: Workout } }
  | { type: "CREATE_WORKOUT"; payload: { routineId: string; workout: Workout } }
  | { type: "UPDATE_WORKOUT"; payload: { routineId: string; workout: Workout } }
  | {
      type: "DELETE_WORKOUT";
      payload: { routineId: string; workout: Workout };
    };

export const RoutinesContext = createContext<{
  state: RoutineContextType;
  dispatch: React.Dispatch<ACTIONTYPE>;
}>({ state: { routines: [] }, dispatch: () => null });

const routinesReducer = (prevState: RoutineContextType, action: ACTIONTYPE) => {
  switch (action.type) {
    case "SET_ROUTINES":
      return {
        routines: action.payload,
      };
    case "CREATE_ROUTINE":
      return {
        routines: [action.payload, ...prevState.routines],
      };
    case "DELETE_ROUTINE":
      return {
        routines: prevState.routines.filter(
          (r) => r.id !== action.payload.routineId,
        ),
      };
    case "UPDATE_ROUTINE":
      return {
        routines: prevState.routines.map((r) =>
          r.id === action.payload.id
            ? { ...action.payload, workouts: r.workouts }
            : r,
        ),
      };
    case "ADD_WORKOUT":
      return {
        routines: prevState.routines.map((r) => {
          if (r.id === action.payload.routineId) {
            return {
              ...r,
              workouts: [...r.workouts, action.payload.workout],
            };
          }
          return r;
        }),
      };
    case "CREATE_WORKOUT":
      return {
        routines: prevState.routines.map((r) => {
          if (r.id === action.payload.routineId) {
            return {
              ...r,
              workouts: [...r.workouts, action.payload.workout],
            };
          }
          return r;
        }),
      };
    case "UPDATE_WORKOUT":
      return {
        routines: prevState.routines.map((r) => {
          if (r.id === action.payload.routineId) {
            return {
              ...r,
              workouts: r.workouts.map((w) =>
                w.id === action.payload.workout.id ? action.payload.workout : w,
              ),
            };
          }
          return r;
        }),
      };
    case "DELETE_WORKOUT":
      return {
        routines: prevState.routines.map((r) => {
          if (r.id === action.payload.routineId) {
            return {
              ...r,
              workouts: r.workouts.filter(
                (w) => w.id !== action.payload.workout.id,
              ),
            };
          }
          return r;
        }),
      };
    default:
      return prevState;
  }
};

export const RoutinesContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [state, dispatch] = useReducer(routinesReducer, { routines: [] });
  return (
    <RoutinesContext.Provider value={{ state, dispatch }}>
      {children}
    </RoutinesContext.Provider>
  );
};
