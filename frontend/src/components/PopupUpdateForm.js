import React, {useState} from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { api_base } from "../utils"

export const PopupUpdateForm = ({ workout }) => {
    const {dispatch} = useWorkoutsContext()
    const [title, setTitle] = useState(workout.title)
    const [load, setLoad] = useState(workout.load)
    const [reps, setReps] = useState(workout.reps)
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const { user } = useAuthContext();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!user){
            setError("You must be logged in to add a workout");
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({title, load, reps}),
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        });
        const json = await res.json();
        if(!res.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if(res.ok){
            setError(null);
            setEmptyFields([]);
            dispatch({type: "UPDATE_WORKOUT", payload: {title, load, reps}});
        }
    }
    return (
        <form className="popup-form" onSubmit={handleSubmit}>
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