import { NextFunction, Request } from "express";
import { TypeSafeResponse } from "../../utils/express.types";
import { Routine } from "../entities/routine.entity";
import RoutineService from "../services/routine.service";
import { zParse } from "../../utils/zod";
import {
  CreateRoutineRequest,
  GetRoutinesRequest,
  UpdateRoutineRequest,
  idRequest,
} from "../routine.types";
import { DeleteResult } from "typeorm";

const post = async (
  req: Request,
  res: TypeSafeResponse<Routine>,
  next: NextFunction,
) => {
  try {
    console.log(req.headers);
    const { body, headers } = await zParse(CreateRoutineRequest, req);
    const { title, description, timeToComplete } = body;
    const userId = headers["x-user-id"];

    const routine = await RoutineService.post(
      title,
      description,
      userId,
      timeToComplete,
    );
    res.status(201).json({
      message: "Routine created successfully",
      data: routine,
    });
  } catch (err) {
    next(err);
  }
};

const getMine = async (
  req: Request,
  res: TypeSafeResponse<Routine[]>,
  next: NextFunction,
) => {
  try {
    const { headers } = await zParse(GetRoutinesRequest, req);
    const userId = headers["x-user-id"];
    const routines = await RoutineService.getMine(userId);
    res.status(200).json({
      message: "Routines found successfully",
      data: routines,
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (
  _: Request,
  res: TypeSafeResponse<Routine[]>,
  next: NextFunction,
) => {
  try {
    const routines = await RoutineService.getAll();
    res.status(200).json({
      message: "Routines found successfully",
      data: routines,
    });
  } catch (err) {
    next(err);
  }
};

const put = async (
  req: Request,
  res: TypeSafeResponse<Routine>,
  next: NextFunction,
) => {
  try {
    const { body, headers, params } = await zParse(UpdateRoutineRequest, req);
    const updatedRoutine = await RoutineService.put(
      params.routineId,
      headers["x-user-id"],
      body,
    );
    res.status(200).json({
      message: "Routine updated successfully",
      data: updatedRoutine,
    });
  } catch (err) {
    next(err);
  }
};

const _delete = async (
  req: Request,
  res: TypeSafeResponse<DeleteResult>,
  next: NextFunction,
) => {
  try {
    const { params, headers } = await zParse(idRequest, req);
    const deleted = await RoutineService._delete(
      params.routineId,
      headers["x-user-id"],
    );
    res.status(200).json({
      message: "Routine deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

const RoutineController = {
  post,
  getMine,
  getAll,
  put,
  _delete,
};

export default RoutineController;
