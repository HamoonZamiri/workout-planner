import Express from "express";
import RoutineController from "../controllers/routine.controller";
import { requireAuth } from "../../middleware/require.auth";

const RoutineRouter = Express.Router();

RoutineRouter.use(requireAuth);

RoutineRouter.route("/")
    .get(RoutineController.getAll)
    .post(RoutineController.post);

RoutineRouter.route("/mine")
    .get(RoutineController.getMine);

RoutineRouter.route("/:routineId").delete(RoutineController._delete);

export default RoutineRouter;