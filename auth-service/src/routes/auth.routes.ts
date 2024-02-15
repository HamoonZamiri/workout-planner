import Express from "express";
import AuthController from "../controller/auth.controller";

const AuthRouter = Express.Router();
AuthRouter.post("/signup", AuthController.signup);
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/refresh", AuthController.refresh);
AuthRouter.post("/authenticate/:id", AuthController.authenticate);

export default AuthRouter;
