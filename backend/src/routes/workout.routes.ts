import Express from "express";
import WorkoutController from "../controllers/workout.controller";
import { requireAuth } from "../middleware/require.auth";

const WorkoutRouter = Express.Router();

WorkoutRouter.use(requireAuth);
WorkoutRouter.route("/").get(WorkoutController.getAllWorkoutsHandler).post(WorkoutController.createWorkoutHandler);
WorkoutRouter.get("/mine", WorkoutController.getWorkoutsByUserIdHandler);
WorkoutRouter.route("/:id").get(WorkoutController.getWorkoutByIdHandler).delete(WorkoutController.deleteWorkoutHandler).put(WorkoutController.updateWorkoutHandler);

export default WorkoutRouter;