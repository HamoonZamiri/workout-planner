import mongoose, { Document } from "mongoose";
import { BeAnObject, IObjectWithTypegooseFunction } from "@typegoose/typegoose/lib/types";

export type MongoDocument<T> = (Document<unknown, BeAnObject, T> & Omit<T & {
    _id: mongoose.Types.ObjectId;
}, "typegooseName"> & IObjectWithTypegooseFunction)