import {useContext} from "react"
import {WorkoutsContext} from "../context/WorkoutContext"


export function useWorkoutsContext() {
    const context = useContext(WorkoutsContext)

    if(!context){
        throw Error("useWorkoutsContext must be used inside a WorkoutsContextProvider Component Tree")
    }
    return context
}