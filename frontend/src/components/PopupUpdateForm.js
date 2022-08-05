import React, {useState} from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

export const PopupUpdateForm = ({ workout }) => {
    const {dispatch} = useWorkoutsContext()
    const [title, setTitle] = useState(workout.title)
    const [load, setLoad] = useState(workout.load)
    const [reps, setReps] = useState(workout.reps)
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])


    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({title, load, reps}),
            headers:{
                "Content-Type": "application/json"
            }
        });
        const json = await res.json();

        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {title, load, reps}});
        }
    }
    return (
        <form className="workout-form" onSubmit={handleSubmit}>
            <h3>Update {workout.title}</h3>
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
            <button>Update Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}