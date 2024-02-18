import Express from "express";
import RoutineController from "../controllers/routine.controller";

const RoutineRouter = Express.Router();

//RoutineRouter.use(requireAuth);

RoutineRouter.route("/")
  .get(RoutineController.getAll)
  .post(RoutineController.post);

RoutineRouter.route("/mine/:userId").get(RoutineController.getMine);

RoutineRouter.route("/:userId/:routineId")
  .delete(RoutineController._delete)
  .put(RoutineController.put);

export default RoutineRouter;
