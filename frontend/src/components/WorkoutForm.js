import React, {useState} from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

export default function WorkoutForm(){
    const {dispatch} = useWorkoutsContext()
    const [title, setTitle] = useState("")
    const [load, setLoad] = useState("")
    const [reps, setReps] = useState("")
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const { user } = useAuthContext()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!user){
            setError("You must be logged in to add a workout");
            return;
        }
        const workout = {title, load, reps}

        const res = await fetch('https://fitlog-workout-planner.herokuapp.com/api/workouts', {
            method: "POST",
            body: JSON.stringify(workout),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })

        const json = await res.json()

        if(!res.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(res.ok){
            setError(null)
            setEmptyFields([])
            setTitle("")
            setLoad("")
            setReps("")
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
                className={emptyFields && emptyFields.includes("title") ? "error" : ""}
            />

        <label>Load (kg):</label>
            <input
                type="text"
                onChange={(event) => setLoad(event.target.value)}
                value={load}
                className={emptyFields && emptyFields.includes("load") ? "error" : ""}
            />

        <label># of Reps:</label>
            <input
                type="text"
                onChange={(event) => setReps(event.target.value)}
                value={reps}
                className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
        <button>Add Workout</button>
        {error && <div className="error">{error}</div>}
        </form>
    )
}