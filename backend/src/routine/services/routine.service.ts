import { FitlogCoreDataSource } from "../../db/pgres.datasource";
import { Routine } from "../entities/routine.entity";
import { RoutineUpdateFields } from "../routine.types";
import AppError from "../../utils/AppError";
import amqp from "amqplib";
import WorkoutService from "../../workout/services/workout.service";

const RoutineRepository = FitlogCoreDataSource.getRepository(Routine);

const getAll = async () => {
  // return RoutineRepository.find({ relations: { workouts: true }});
  return RoutineRepository.createQueryBuilder("routine")
    .where("routine.title != :title", { title: "Default" })
    .getMany();
};

const post = async (
  title: string,
  description: string,
  userId: string,
  timeToComplete: number,
) => {
  const routine = RoutineRepository.create({
    title,
    description,
    userId,
    timeToComplete,
  });
  return RoutineRepository.save(routine);
};

const getById = async (routineId: string) => {
  const routine = await RoutineRepository.findOneBy({ id: routineId });
  if (!routine) {
    throw new AppError(400, "Routine was not found!");
  }
  return routine;
};

const getMine = async (userId: string) => {
  return RoutineRepository.find({
    where: {
      userId,
    },
    relations: { workouts: true },
  });
};

const getByTitle = async (title: string) => {
  const routine = await RoutineRepository.findOneBy({ title });
  if (!routine) {
    throw new AppError(400, "Routine was not found!");
  }
  return routine;
};

const put = async (
  routineId: string,
  userId: string,
  updates: RoutineUpdateFields,
) => {
  let routine = await RoutineRepository.findOneBy({ id: routineId });
  if (!routine) {
    throw new AppError(400, "Routine was not found!");
  }

  if (userId !== routine.userId) {
    throw new AppError(401, "Routine does not belong to you");
  }

  routine = { ...routine, ...updates } as Routine;
  return RoutineRepository.save(routine, { reload: true });
};

const _delete = async (routineId: string, userId: string) => {
  const routine = await RoutineRepository.findOneBy({ id: routineId });
  if (!routine) {
    throw new AppError(400, "Routine was not found!");
  }
  if (routine.userId !== userId) {
    throw new AppError(401, "Routine does not belong to you");
  }

  return RoutineRepository.delete({ id: routineId });
};

export async function handleUserCreated(message: amqp.ConsumeMessage) {
  const messageContent = message.content.toString();
  const user = JSON.parse(messageContent) as { id: string; email: string };
  const routine = await post("Default", "Default routine", user.id, 0);
  await WorkoutService.post(
    {
      title: "Bench Press",
      routineId: routine.id,
      setsLow: 3,
      setsHigh: 5,
      repsLow: 10,
      repsHigh: 12,
      load: 135,
    },
    user.id,
  );
}

const RoutineService = {
  post,
  getById,
  getMine,
  getByTitle,
  put,
  getAll,
  _delete,
};

export default RoutineService;
