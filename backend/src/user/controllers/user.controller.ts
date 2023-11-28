import { NextFunction, Request } from "express";
import UserService from "../services/user.service";
import { TypeSafeResponse } from "../../utils/express.types";
import { GetByIdRequestDTO, LoginRequestDTO, SignupRequestDTO, UserDTO, UserLoginDTO } from "../user.types";
import { zParse } from "../../utils/zod";

// controller handlers
const login = async (
	req: Request,
	res: TypeSafeResponse<UserLoginDTO>,
	next: NextFunction
) => {
	try {
        const { body } = await zParse(LoginRequestDTO, req);

        const user = await UserService.login(body.email, body.password);
		const token = UserService.createToken(user.id);

		res.status(200).json({
			message: "User logged in successfully",
			data: { id: user.id, email: user.email, token },
		});

	} catch (err) {
		next(err);
	}
};

const post = async (
	req: Request,
	res: TypeSafeResponse<UserLoginDTO>,
	next: NextFunction
) => {
	try {
        const { body } = await zParse(SignupRequestDTO, req);
		const { email, password } = body;

		const user = await UserService.post(email, password);
		const token = UserService.createToken(user.id);

		res.status(200).json({
			message: "User created successfully",
			data: { id: user.id, email: user.email, token },
		});

	} catch (err) {
		next(err);
	}
};

const getById = async (
	req: Request,
	res: TypeSafeResponse<UserDTO>,
	next: NextFunction
) => {
    try {
        const { params } = await zParse(GetByIdRequestDTO, req);
        const user = await UserService.getById(params.userId);
        res.status(200).json({
            message: "User found successfully",
            data: { id: user.id, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

const UserController = {
	login,
	post,
    getById,
};

export default UserController;
