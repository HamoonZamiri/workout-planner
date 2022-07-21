import {workout_schema} from "../models/workoutModel.js"
import mongoose from "mongoose"


//get all workouts
export const getWorkouts = async(req, res) => {
    //schema.find can be passed in {field: val} to return all elements with field = val
    //empty braces passed into .find will return all elements in the db
    const workouts = await workout_schema.find({}).sort({createdAt: -1})

    res.status(200).json(workouts)

}
//get a single workout
export const getWorkout = async(req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"})
    }
    const workout = await workout_schema.findById(id)

    if(!workout) {
        return res.status(404).json({error: "No such workout found"})
    }
    res.status(200).json(workout)
}

//create new workout
export const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body;
    try {
        const workout = await workout_schema.create({title, load, reps});
        res.status(200).json(workout);
    }catch (error){
        res.status(400).json({error: error.message})


    }
}
//delete workout
export const deleteWorkout = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"})
    }
    const workout = await workout_schema.findOneAndDelete({_id: id})

    if(!workout) {
        return res.status(404).json({error: "No such workout found"})
    }

    res.status(200).json(workout);

}

//update a workout
export const updateWorkout = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"})
    }

    const workout = await workout_schema.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    if(!workout){
        return res.status(404).json({error: "No such workout found"})
    }
    res.status(200).json(workout)
}

