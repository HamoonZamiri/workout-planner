import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import Popup from 'reactjs-popup'
import { PopupUpdateForm } from './PopupUpdateForm'
import { useAuthContext } from '../hooks/useAuthContext'
import { api_base } from '../utils'
import {AiFillPlusCircle, AiFillMinusCircle} from "react-icons/ai"

const WorkoutDetails =  ({ workout }) => {
    const loadInc = 5; //value to increment load by with buttons
    const repInc = 1; //value to increment reps by with buttons
    const { user } = useAuthContext()

    const { dispatch } = useWorkoutsContext()
    const handleClick = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        })
        //const json = await res.json()

        if(res.ok){
            dispatch({type: "DELETE_WORKOUT", payload: workout})

        }
    }
    const handleIncrementLoad = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, load: workout.load + loadInc}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        //const json = await res.json()
        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...workout, load: workout.load + loadInc}});
        }
    }

    const handleDecrementLoad = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, load: workout.load - loadInc}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        //const json = await res.json()

        if (res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...workout, load: workout.load - loadInc}});
        }
    }
    const handleIncrementReps = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, reps: workout.reps + repInc}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        //const json = await res.json()
        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...workout, reps: workout.reps + repInc}});
        }
    }

    const handleDecrementReps = async () => {
        if(!user){
            return;
        }
        const res = await fetch(api_base + "api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, reps: workout.reps - repInc}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        //const json = await res.json()
        if (res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...workout, reps: workout.reps - repInc}});
        }
    }
    return (
        <div className="grid grid-cols-1 bg-slate-100 border-solid
        border-inherit border-4 rounded-md p-2 sm:flex-shrink-0 sm:w-[350px]">
            <h4 className="text-xl font-semibold flex justify-center">{workout.title}</h4>

            <div className="flex gap-4 justify-center">
                <p><strong>Load (kg): </strong>{workout.load}</p>
                <div className="flex gap-1">
                    <div className="cursor-pointer flex items-center" onClick={handleDecrementLoad}><AiFillMinusCircle /></div>
                    <div className="cursor-pointer flex items-center" onClick={handleIncrementLoad}><AiFillPlusCircle /></div>
                </div>
            </div>
            <div className="flex gap-4 justify-center">
                <p><strong>Reps: </strong>{workout.reps}</p>
                <div className="flex gap-1">
                    <div className="cursor-pointer flex items-center" onClick={handleDecrementReps}><AiFillMinusCircle /></div>
                    <div className="cursor-pointer flex items-center" onClick={handleIncrementReps}><AiFillPlusCircle /></div>
                </div>
            </div>
            <div className="flex justify-center">
                <span className="material-symbols-outlined cursor-pointer" onClick={handleClick}>delete</span>
                <Popup trigger={<button className="">Edit Workout</button>}>
                    <div className='popup'>
                        <PopupUpdateForm workout={workout}/>
                    </div>
                </Popup>
            </div>
        </div>
    )

}
export default WorkoutDetails