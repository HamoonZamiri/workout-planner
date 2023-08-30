import Express from "express";
import UserController from "../controllers/user.controller";

const UserRouter = Express.Router();
UserRouter.route("/login").post(UserController.loginHandler);
UserRouter.route("/signup").post(UserController.signupHandler);

export default UserRouter;