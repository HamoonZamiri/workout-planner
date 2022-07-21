import React, {useState} from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

export default function WorkoutForm(){
    const {dispatch} = useWorkoutsContext()
    const [title, setTitle] = useState("")
    const [load, setLoad] = useState("")
    const [reps, setReps] = useState("")
    const [error, setError] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const workout = {title, load, reps}

        const res = await fetch('/api/workouts', {
            method: "POST",
            body: JSON.stringify(workout),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()

        if(!res.ok) {
            setError(json.error)
        }
        if(res.ok){
            setTitle("")
            setLoad("")
            setReps("")
            setError(null)
            dispatch({type: "CREATE_WORKOUT", payload: json})
            console.log("Workout Added")
        }

    }

    return (
        <form className="workout-form" onSubmit={handleSubmit}>
            <h3>Add a New Workout</h3>
            <label>Exercise Name:</label>
            <input
                type="text"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
            />

        <label>Load (kg):</label>
            <input
                type="text"
                onChange={(event) => setLoad(event.target.value)}
                value={load}
            />

        <label># of Reps:</label>
            <input
                type="text"
                onChange={(event) => setReps(event.target.value)}
                value={reps}
            />
        <button>Add Workout</button>
        {error && <div className="error">{error}</div>}
        </form>
    )
}