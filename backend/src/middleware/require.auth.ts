import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express";
dotenv.config();
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json({error: "Authorization token required"});

    }
    const token = authorization.split(" ")[1];
    try {
        const _id = jwt.verify(token, process.env.SECRET ? process.env.SECRET : "");
        const user = await UserModel.findOne({_id} );
        if(!user) {
            throw new Error("User not found");
        }
        req.body.userId = user._id.toString();
        req.body.email = user.email;
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({error: "Request was not authorized"});
    }
}