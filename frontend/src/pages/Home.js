import React, {useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext";

import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { api_base } from "../utils";

const Home = () => {
    const {workouts, dispatch} = useWorkoutsContext();
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
    }, [dispatch, user])


    return (
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => {
                   return <WorkoutDetails key={workout._id} workout={workout} />
                })}
                <WorkoutForm />
            </div>


        </div>
    )
}

export default Home;