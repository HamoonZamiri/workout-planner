import { getModelForClass, prop } from "@typegoose/typegoose";

export class Workout {
    @prop({required: true})
    title: string

    @prop({required: true})
    reps: number

    @prop({required: true})
    load: number

    @prop({required: true})
    user_id: string

}
export const WorkoutModel = getModelForClass(Workout);