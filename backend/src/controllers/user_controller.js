import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
    //use jwt library to create a token and return it
    //first arg to sign is secret, second is secret string in ENV file
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: "3d"});
}
//login user
export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        //create a jwt
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}

//signup user
export const signupUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.signup(email, password);
        //create a jwt
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    }
    catch(err){
        res.status(400).json({error: err.message});
    }

}