import React, {useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext";

import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { api_base } from "../utils";

const Home = () => {
    const {state, workouts, dispatch} = useWorkoutsContext();
    const { user } = useAuthContext();
    useEffect(() => {
        const fetchWorkouts = async () => {
            const res = await fetch(api_base + "api/workouts", {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const json = await res.json()
            if (res.ok) {
                dispatch({type: "SET_WORKOUTS", payload: json})
            }
        }
        if(user){
            fetchWorkouts();
        }
    }, [state, dispatch, user])


    return (
        <div className="mt-2 p-2">
            <h2 className="font-semibold text-2xl w-full">Exercises:</h2>
            <div className="flex flex-col overflow-x-scroll sm:flex-row sm:flex-shrink-0 max-w-screen gap-2 mb-4">
                {workouts && workouts.map((workout) => {
                return <WorkoutDetails key={workout._id} workout={workout} />
                })}
            </div>
            <div className="flex justify-center">
                <WorkoutForm />
            </div>
        </div>
    )
}

export default Home;