import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv"
import UserService from "../user/services/user.service";
dotenv.config();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if(!authorization) {
        res.status(401).json({error: "Authorization token required"});
        return;
    }
    const token = authorization.split(" ")[1];
    try {
        const _id = jwt.verify(token, process.env.SECRET ? process.env.SECRET : "");
        if(typeof _id === "string") {
            throw new Error("Invalid token");
        }
        const user = await UserService.findUserById(_id._id);
        if(!user) {
            throw new Error("User not found");
        }
        req.body.userId = "" + user.id;
        req.body.email = user.email;
        next();
    }
    catch(error){
        next(error);
    }
}