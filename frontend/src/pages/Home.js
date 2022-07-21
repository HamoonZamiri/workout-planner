import React, {useEffect} from "react"

import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

const Home = () => {
    const {workouts, dispatch} = useWorkoutsContext()
    useEffect(() => {
        const fetchWorkouts = async () => {
            const res = await fetch('/api/workouts')
            const json = await res.json()
            if (res.ok) {
                dispatch({type: "SET_WORKOUTS", payload: json})
            }
        }
        fetchWorkouts()
    }, [])


    return (
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => {
                   return <WorkoutDetails key={workout.id} workout={workout} />
                })}
                <WorkoutForm />
            </div>


        </div>
    )
}

export default Home;