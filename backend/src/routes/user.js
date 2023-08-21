import express from "express";
//controller functions
import { loginUser, signupUser } from "../controllers/user_controller.js";
export const user_router = express.Router();

//login route
user_router.post("/login", loginUser);

//signup route
user_router.post("/signup", signupUser);