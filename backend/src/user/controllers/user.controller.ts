import { NextFunction } from "express";
import UserService from "../services/user.service";
import AppError from "../../utils/AppError";
import { TypeSafeRequest, TypeSafeResponse } from "../../utils/express.types";

// types
type LoginRequestBody = {
    email: string;
    password: string;
}
type SignupRequestBody = LoginRequestBody;
type UserDTO = {
    id: string;
    email: string;
    token: string;
}

// controller handlers
const loginHandler = async(req: TypeSafeRequest<{}, LoginRequestBody, {}>, res: TypeSafeResponse<UserDTO>, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.loginUser(email, password);
        if (!user) {
            throw new AppError(404, "User not found");
        }
        const token = UserService.createToken(user.id);
        res.status(200).json({"message": "User logged in successfully", data: {id: user.id, email: user.email, token}});
    }
    catch(err) {
        next(err);
    }
};

const signupHandler = async(req: TypeSafeRequest<{}, SignupRequestBody, {}>, res: TypeSafeResponse<UserDTO>, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await UserService.signupUser(email, password);
        const token = UserService.createToken(user.id);
        res.status(200).json({message: "User created successfully", data: {id: user.id, email: user.email, token}});
    }
    catch(err) {
        next(err);
    }
}

const UserController = {
    loginHandler,
    signupHandler,
}
export default UserController;