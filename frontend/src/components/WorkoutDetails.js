import React from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import Popup from 'reactjs-popup'
import formatDistanceToNow from 'date-fns/formatDistance'
import { PopupUpdateForm } from './PopupUpdateForm'

const WorkoutDetails =  ({ workout }) => {
    const loadInc = 5; //value to increment load by with buttons
    const repInc = 1; //value to increment reps by with buttons

    const [rerender, setRerender] = React.useState(workout);

    const { dispatch } = useWorkoutsContext()
    const handleClick = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "DELETE"
        })
        const json = await res.json()

        if(res.ok){
            dispatch({type: "DELETE_WORKOUT", payload: json})

        }
    }
    const handleIncrementLoad = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, load: workout.load + loadInc}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await res.json()
        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...json, load: json.load + loadInc}});
        }
    }

    const handleDecrementLoad = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, load: workout.load - loadInc}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await res.json()

        if (res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...json, load: json.load - loadInc}});
        }
    }
    const handleIncrementReps = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, reps: workout.reps + repInc}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await res.json()
        if(res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...json, reps: json.reps + repInc}});
        }
    }

    const handleDecrementReps = async () => {
        const res = await fetch("/api/workouts/" + workout._id, {
            method: "PATCH",
            body: JSON.stringify({...workout, reps: workout.reps - repInc}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await res.json()
        if (res.ok){
            dispatch({type: "UPDATE_WORKOUT", payload: {...json, reps: json.reps - repInc}});
        }
    }
    return (
        <div className="workout-details">
            <h4>{workout.title}</h4>

            <p>
                <strong>Load (kg): </strong>{workout.load}
                <button onClick={handleDecrementLoad}>-</button><button onClick={handleIncrementLoad}>+</button>
            </p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <button onClick={handleDecrementReps}>-</button><button onClick={handleIncrementReps}>+</button>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            <Popup trigger={<button>Edit Workout</button>} position="right">
                <div className='popup-form'>
                    <PopupUpdateForm workout={workout} />
                </div>
            </Popup>
        </div>
    )

}
export default WorkoutDetails