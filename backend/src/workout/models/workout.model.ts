import { getModelForClass, prop } from "@typegoose/typegoose";

export class Workout {
    @prop({required: true})
    title: string

    @prop({required: true})
    reps: number

    @prop({required: true})
    load: number

    @prop({required: true})
    sets: number
    
    @prop({required: true})
    user_id: string

    @prop()
    routine_id: string

    @prop()
    timeToCompleteSet: number
}
export const WorkoutModel = getModelForClass(Workout);