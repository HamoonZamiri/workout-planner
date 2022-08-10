import {workout_schema} from "../models/workoutModel.js"
import mongoose from "mongoose"


//get all workouts
export const getWorkouts = async(req, res) => {
    //schema.find can be passed in {field: val} to return all elements with field = val
    //empty braces passed into .find will return all elements in the db
    const user_id = req.user._id;
    const workouts = await workout_schema.find({ user_id }).sort({createdAt: -1});

    res.status(200).json(workouts);

}
//get a single workout
export const getWorkout = async(req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"});
    }
    const workout = await workout_schema.findById(id);

    if(!workout) {
        return res.status(404).json({error: "No such workout found"});
    }
    res.status(200).json(workout);
}

//create new workout
export const createWorkout = async (req, res) => {
    const {title, load, reps} = req.body;
    let emptyFields = []
    if(!title){
        emptyFields.push("title");
    }
    if(!load){
        emptyFields.push("load");
    }
    if(!reps){
        emptyFields.push("reps");
    }
    if(emptyFields.length > 0){
        return res.status(400).json( {error: "Please fill in all the fields", emptyFields: emptyFields} );
    }

    try {
        const user_id = req.user._id;
        const workout = await workout_schema.create({title, load, reps, user_id});
        res.status(200).json(workout);
    }catch (error){
        res.status(400).json({error: error.message});


    }
}
//delete workout
export const deleteWorkout = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"});
    }
    const workout = await workout_schema.findOneAndDelete({_id: id});

    if(!workout) {
        return res.status(404).json({error: "No such workout found"});
    }

    res.status(200).json(workout);

}

//update a workout
export const updateWorkout = async (req, res) => {
    const { id } = req.params;
    const {title, load, reps} = req.body;

    let emptyFields = [];
    if(!title){
        emptyFields.push("title");
    }
    if(!load && load !== 0){
        emptyFields.push("load");
    }
    if(!reps){
        emptyFields.push("reps");
    }

    if(emptyFields.length > 0){
        return res.status(400).json( {error: "Please fill in all the fields", emptyFields: emptyFields} );
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such workout found"});
    }

    const workout = await workout_schema.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    if(!workout){
        return res.status(404).json({error: "No such workout found"});
    }
    res.status(200).json(workout);
}

