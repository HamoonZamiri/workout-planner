import React, {useState} from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { api_base } from "../utils"

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

        const res = await fetch(api_base + "api/workouts", {
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
        <form className="grid grid-cols-1 gap-8" onSubmit={handleSubmit}>
            <h3 className="font-semibold text-2xl">Add a New Exercise</h3>
            <div>
                <label>Exercise Name:</label>
                <input
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    type="text"
                    onChange={(event) => setTitle(event.target.value)}
                    value={title}
                    // className={emptyFields && emptyFields.includes("title") ? "error" : ""}
                />
            </div>

        <div>
            <label>Load (kg):</label>
                <input
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                    type="text"
                    onChange={(event) => setLoad(event.target.value)}
                    value={load}
                    // className={emptyFields && emptyFields.includes("load") ? "error" : ""}
                />
        </div>
        <div>
            <label># of Reps:</label>
            <input
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                type="text"
                onChange={(event) => setReps(event.target.value)}
                value={reps}
                // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
        </div>
        <button className="w-full h-8 bg-blue-100 hover:bg-blue-200">Add Workout</button>
        {error && <div className="error">{error}</div>}

        </form>
    )
}