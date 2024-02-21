import Express from "express";
import WorkoutController from "../controllers/workout.controller";

const WorkoutRouter = Express.Router();

WorkoutRouter.route("/")
  .get(WorkoutController.getAll)
  .post(WorkoutController.post);

WorkoutRouter.get("/mine", WorkoutController.getMine);

WorkoutRouter.route("/:id")
  .get(WorkoutController.getById)
  .delete(WorkoutController._delete)
  .put(WorkoutController.put);

export default WorkoutRouter;

