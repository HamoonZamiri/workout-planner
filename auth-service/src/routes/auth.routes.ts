import Express from "express";
import AuthController from "../controller/auth.controller";

const AuthRouter = Express.Router();
AuthRouter.post("/signup", AuthController.signup);
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/refresh/:id", AuthController.refresh);
AuthRouter.post("/authenticate", AuthController.authenticate);
AuthRouter.get("/users", AuthController.getAllUsers);

export default AuthRouter;
