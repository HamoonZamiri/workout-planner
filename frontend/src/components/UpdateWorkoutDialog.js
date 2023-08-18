import { Dialog } from "@headlessui/react"
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { api_base } from "../utils.js";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext.js";

const UpdateWorkoutDialog = ({workout, open, setOpen }) => {
    const [title, setTitle] = useState(workout.title);
    const [load, setLoad] = useState(workout.load);
    const [reps, setReps] = useState(workout.reps);
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])
    const {dispatch} = useWorkoutsContext();
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
            dispatch({type: "UPDATE_WORKOUT", payload: {_id: workout._id, title, load, reps}});
            setOpen(false);
        }
    }
    return (<Dialog className="absolute inset-0 h-screen flex justify-center items-center hover:cursor-pointer bg-gray-600 z-10 w-screen  bg-opacity-90 rounded-lg p-4" open={open} onClose={() => setOpen(false)}>
            <Dialog.Panel>
                <form className="rounded-lg border bg-white p-3 w-[400px] grid grid-cols-1 gap-8 hover:cursor-default" onSubmit={() => {}}>
                    <Dialog.Title className="font-semibold text-xl">Edit Workout</Dialog.Title>
                    <div>
                        <label>Exercise Name:</label>
                        <input
                            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            type="text"
                            onChange={(event) => setTitle(event.target.value)}
                            value={title}

                        />
                        <p className="text-red-300">{emptyFields.includes("title") && "This field is required"}</p>
                    </div>
                    <div>
                        <label>Load (kg):</label>
                        <input
                            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            type="text"
                            onChange={(event) => setLoad(event.target.value)}
                            value={load}
                        />
                        <p className="text-red-300">{emptyFields.includes("load") && "This field is required"}</p>
                    </div>
                    <div>
                        <label># of Reps:</label>
                        <input
                            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                            type="text"
                            onChange={(event) => setReps(event.target.value)}
                            value={reps}
                        />
                        <p className="text-red-300">{emptyFields.includes("reps") && "This field is required"}</p>
                    </div>
                    <button onClick={handleSubmit} className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10 p-2">Update {workout.title}</button>
                    {error && <div className="text-red-300">{error}</div>}
                </form>
            </Dialog.Panel>
        </Dialog>)
}

export default UpdateWorkoutDialog;