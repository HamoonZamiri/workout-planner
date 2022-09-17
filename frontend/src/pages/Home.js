import React, {useEffect, useState} from "react"
import { useAuthContext } from "../hooks/useAuthContext";

import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

const Home = () => {
    const {workouts, dispatch} = useWorkoutsContext();
    // eslint-disable-next-line no-unused-vars
    const [workoutUpdated, setWorkoutUpdated] = useState(false);
    const { user } = useAuthContext();
    useEffect(() => {
        const fetchWorkouts = async () => {
            const res = await fetch('https://fitlog-workout-planner.herokuapp.com/api/workouts', {
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
        setWorkoutUpdated(false);
    }, [dispatch, user, workouts])


    return (
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => {
                   return <WorkoutDetails key={workout._id} workout={workout} setWorkoutUpdated={setWorkoutUpdated} />
                })}
                <WorkoutForm />
            </div>


        </div>
    )
}

export default Home;