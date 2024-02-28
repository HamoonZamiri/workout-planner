import { Request, Response, NextFunction } from "express";
import { APIResponse } from "./types";
import constants from "./constants";
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token not found!" });
  }
  const authRes = await fetch(
    `${constants.AUTH_SERVICE}/api/auth/authenticate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (authRes.status === 200) {
    const json = (await authRes.json()) as APIResponse<{ userId: string }>;
    req.headers["user-id"] = json.data.userId;
  } else {
    res.status(401).json({ message: "Unauthorized, token invalid!" });
    return;
  }
  next();
}
