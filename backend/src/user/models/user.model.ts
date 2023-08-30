import { getModelForClass, prop } from "@typegoose/typegoose";

export class User {
    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public password!: string;
}

export const UserModel = getModelForClass(User);
