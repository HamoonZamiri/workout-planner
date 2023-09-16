import Express from "express";
import RoutineController from "../controllers/routine.controller";
import { requireAuth } from "../../middleware/require.auth";

const RoutineRouter = Express.Router();
RoutineRouter.use(requireAuth);
RoutineRouter.route("/:userId")
    .get(RoutineController.getUserRoutinesHandler)
    .post(RoutineController.postRoutineHandler);

export default RoutineRouter;