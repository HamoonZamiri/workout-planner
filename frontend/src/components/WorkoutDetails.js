import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'

export default function WorkoutDetails ({ workout }) {
    const { dispatch } = useWorkoutsContext()
    const handleClick = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "DELETE"
        })
        const json = await res.json

        if(res.ok){
            dispatch({type: "DELETE_WORKOUT", payload: json})
        }
    }
    return (
        <div className="workout-details">
            <h4>{workout.title}</h4>
            <p><strong>Load (kg): </strong>{workout.load}</p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <p>{workout.createdAt}</p>
            <span onClick={handleClick}>delete</span>
        </div>
    )

}