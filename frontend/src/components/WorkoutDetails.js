import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import Popup from 'reactjs-popup'
import { PopupUpdateForm } from './PopupUpdateForm'
import { useAuthContext } from '../hooks/useAuthContext'
import { api_base } from '../utils'

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
        <div className="workout-details">
            <h4>{workout.title}</h4>

            <div className="workout-load-details">
                <p><strong>Load (kg): </strong>{workout.load}</p>
                <button onClick={handleDecrementLoad}>-</button>
                <button onClick={handleIncrementLoad}>+</button>
            </div>
            <div className="workout-reps-details">
                <p><strong>Reps: </strong>{workout.reps}</p>
                <button onClick={handleDecrementReps}>-</button>
                <button onClick={handleIncrementReps}>+</button>
            </div>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            <Popup trigger={<button className="edit-workout">Edit Workout</button>} position="right">
                <div className='popup'>
                    <PopupUpdateForm workout={workout}/>
                </div>
            </Popup>
        </div>
    )

}
export default WorkoutDetails