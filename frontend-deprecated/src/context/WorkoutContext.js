import React, {createContext, useReducer} from "react"

export const WorkoutsContext = createContext()
export function workoutsReducer(prevState, action) {
    switch (action.type) {
        case "SET_WORKOUTS":
            return {
                workouts: action.payload
            }
        case "CREATE_WORKOUT":
            return {
                workouts: [action.payload, ...prevState.workouts]
            }
        case "DELETE_WORKOUT":
            return {
                workouts: prevState.workouts.filter(w => w._id !== action.payload._id)
            }
        case "UPDATE_WORKOUT":
            return {
                workouts: prevState.workouts.map(w => w._id === action.payload._id ? action.payload : w)
            }
        default:
            return prevState
    }
}

export function WorkoutsContextProvider( { children }) {
    const [state, dispatch] = useReducer(workoutsReducer, {workouts: null}) //use reducer hook for maintaining state across context

    //passing in state and dispatch allow for other pages/components to manage the state of the workouts we are storing
    //children renders the component who is calling this WorkoutContext
    return (
        <WorkoutsContext.Provider value={{...state, dispatch}}>
            { children }

        </WorkoutsContext.Provider>
    )
}