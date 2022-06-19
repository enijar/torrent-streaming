import { JsonWebTokenError } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../entities/user";
import authService from "../services/auth-service";

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // @todo remove this
  return next();
  try {
    const authToken = req.cookies.get("authToken");
    const { uuid = "" } = authService.verify(authToken);

    const user = await User.findOne({ where: { uuid } });

    if (user === null) {
      res.status(401).json({ errors: { server: "Unauthorised" } });
    } else {
      // @ts-ignore
      req.user = user;
      req.cookies.set("authToken", authService.sign(user));
      next();
    }
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ errors: { server: "Unauthorised" } });
    } else {
      console.error(err);
      res.status(500).json({ errors: { server: "Server error" } });
    }
  }
}
