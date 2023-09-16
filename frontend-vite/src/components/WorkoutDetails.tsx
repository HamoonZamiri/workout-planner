import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { Workout } from "../utils/types";
import { api_base } from "../utils/constants";
import { FaHammer } from "react-icons/fa"
import {AiFillPlusCircle, AiFillMinusCircle} from "react-icons/ai"
import UpdateWorkoutDialog from "./UpdateWorkoutDialog";
import { BsTrash } from "react-icons/bs"
type WorkoutDetailsProps = {
    workout: Workout;
};
const WorkoutDetails = ( { workout }: WorkoutDetailsProps) => {
    const [open, setOpen] = useState(false);
    const loadInc = 5; //value to increment load by with buttons
    const repInc = 1; //value to increment reps by with buttons
    const { state } = useAuthContext()
    const { user } = state;

    const { dispatch } = useWorkoutsContext();
    const handleClick = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "/api/workouts/" + workout.id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        const json = await res.json()

        if(res.ok){
            dispatch({type: "DELETE_WORKOUT", payload: json.data})
        }
    }

    const handleIncrement = async (updatedWorkout: Workout) => {
        if (!user) {
            return;
        }
        const res = await fetch(api_base + "/api/workouts/" + workout.id, {
            method: "PUT",
            body: JSON.stringify(updatedWorkout),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        const json = await res.json();
        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: json.data});
        }

    }
    return (
        <div className="relative">
            <div
                className="grid grid-cols-1 bg-slate-100 hover:bg-slate-200 border-solid
                border-inherit border-4 rounded-md p-2 sm:flex-shrink-0 sm:w-[350px] "
            >
                <h4 className="text-xl font-semibold flex justify-center">{workout.title}</h4>
                <div className="flex gap-4 justify-center">
                    <p><strong>Load (kg): </strong>{workout.load}</p>
                    <div className="flex gap-1">
                        <div className="cursor-pointer flex items-center" onClick={() => handleIncrement({...workout, load: workout.load - loadInc})}><AiFillMinusCircle /></div>
                        <div className="cursor-pointer flex items-center" onClick={() => handleIncrement({...workout, load: workout.load + loadInc})}><AiFillPlusCircle /></div>
                    </div>
                </div>
                <div className="flex gap-4 justify-center">
                    <p><strong>Reps: </strong>{workout.reps}</p>
                    <div className="flex gap-1">
                        <div className="cursor-pointer flex items-center" onClick={() => handleIncrement({...workout, reps: workout.reps - repInc})}><AiFillMinusCircle /></div>
                        <div className="cursor-pointer flex items-center" onClick={() => handleIncrement({...workout, reps: workout.reps + repInc})}><AiFillPlusCircle /></div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <FaHammer className="cursor-pointer" onClick={() => setOpen(true)} />
                    <BsTrash className="cursor-pointer" onClick={handleClick} />
                </div>
            </div>
            <UpdateWorkoutDialog open={open} setOpen={setOpen} workout={workout}/>
        </div>
    );
};
export default WorkoutDetails;