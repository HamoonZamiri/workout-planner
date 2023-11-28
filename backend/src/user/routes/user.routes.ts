import Express from "express";
import UserController from "../controllers/user.controller";

const UserRouter = Express.Router();
UserRouter.route("/login").post(UserController.login);

UserRouter.route("/signup").post(UserController.post);



export default UserRouter;
