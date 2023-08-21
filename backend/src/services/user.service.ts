import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import {ObjectId} from "mongoose";

export const createToken = (_id: string) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET!);
    return token;
}

export const signupUser = async(email: string, password: string) => {
    if(!email || !password){
        throw new Error("Email and Password are required");
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is invalid");
    }

    // strong password is at least 8 characters long and contains at least one lowercase letter, one uppercase letter, one number, and one symbol
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

    const exists = await UserModel.findOne({ email });
    if(exists) {
        throw new Error("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({ email, password: hashedPassword });
    return user;
};

export const loginUser = async(email: string, password: string) => {
    if(!email || !password){
        throw new Error("Email and Password are required");
    }
    const user = await UserModel.findOne({ email });
    if(!user){
        throw new Error(`No user found with email ${email}`);
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if(!comparePass){
        throw new Error("Password is incorrect");
    }
    return user;
};