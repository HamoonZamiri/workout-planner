import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { UserModel } from "../models/user.model";
import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { User } from "../entities/user.entity";

const UserRepository = FitlogCoreDataSource.getRepository(User);

const createToken = (_id: string) => {
    const token = jwt.sign({ _id }, process.env.SECRET || "");
    return token;
}

const signupUser = async(email: string, password: string) => {
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

    const exists = await UserRepository.findOneBy({email});
    if(exists) {
        throw new Error("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserRepository.create({ email, password: hashedPassword });
    return UserRepository.save(user);
};

const loginUser = async(email: string, password: string) => {
    if(!email || !password){
        throw new Error("Email and Password are required");
    }
    const user = await UserRepository.findOneBy({ email });
    if(!user){
        throw new Error(`No user found with email ${email}`);
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if(!comparePass){
        throw new Error("Password is incorrect");
    }
    return user;
};

const findUserById = async(id: string) => {
    const user = UserRepository.findOneBy({id})
    if(!user){
        throw new Error("User not found");
    }
    return user;
}

const UserService = {
    createToken,
    signupUser,
    loginUser,
    findUserById
}
export default UserService;