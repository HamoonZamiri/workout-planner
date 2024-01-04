import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { UserModel } from "../models/user.model";
import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { User } from "../entities/user.entity";
import RoutineService from "../../routine/services/routine.service";

const UserRepository = FitlogCoreDataSource.getRepository(User);

const createToken = (_id: string) => {
	const token = jwt.sign({ _id }, process.env.SECRET || "");
	return token;
};

const isValidEmail = (email: string | null): boolean => {
	if (!email) {
		return false;
	}
	if (!validator.isEmail(email)) {
		return false;
	}
	return true;
};

const isValidPassword = (password: string | null): boolean => {
	if (!password) {
		return false;
	}
	if (!validator.isStrongPassword(password)) {
		return false;
	}
	return true;
};

const post = async (email: string, password: string): Promise<User> => {
	if (!isValidEmail(email)) {
		throw new Error("Email is not valid");
	}

	if (!isValidPassword(password)) {
		throw new Error(
			"Password is not valid, passwords must be at least 8 characters long" +
				" and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"
		);
	}

	const exists = await UserRepository.findOneBy({ email });
	if (exists) {
		throw new Error("Email already exists");
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = await UserRepository.create({
		email,
		password: hashedPassword,
	});
	const newUser = await UserRepository.save(user);
	await RoutineService.post("Default", "This is the default routine", newUser.id, 60)
	return newUser;
};

const login = async (email: string, password: string) => {
	if (!email || !password) {
		throw new Error("Email and Password are required");
	}
	const user = await UserRepository.findOneBy({ email });
	if (!user) {
		throw new Error(`No user found with email ${email}`);
	}
	const comparePass = await bcrypt.compare(password, user.password);
	if (!comparePass) {
		throw new Error("Password is incorrect");
	}
	return user;
};

const getById = async (id: string) => {
	const user = await UserRepository.findOneBy({ id });
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

const UserService = {
    isValidEmail,
    isValidPassword,
	createToken,
	post,
	login,
	getById,
};
export default UserService;
