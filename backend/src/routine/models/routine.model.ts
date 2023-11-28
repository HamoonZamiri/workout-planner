import { prop } from "@typegoose/typegoose";
import { Workout } from "../../workout/models/workout.model";

export class Routine {
    @prop({required: true})
    public title: string

    @prop({required: true})
    public description: string

    @prop({type: () => [Workout]})
    public exercises: Workout[]

    @prop({default: 0})
    public timeToComplete: number

    @prop({required: true})
    public user_id: string
}