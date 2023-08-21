import { NextFunction, Request, Response } from "express";
import { createToken, loginUser, signupUser } from "../services/user.service";
import AppError from "../utils/AppError";

const postLogin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const token = createToken(user._id.toString());
        res.status(200).json({"message": "User logged in successfully", data: {_id: user._id, email: user.email, token}});
    }
    catch(err) {
        next(err);
    }
};

const postSignup = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await signupUser(email, password);
        const token = createToken(user._id.toString());
        res.status(200).json({"message": "User created successfully", data: {_id: user._id, email: user.email, token}});
    }
    catch(err) {
        next(err);
    }
}