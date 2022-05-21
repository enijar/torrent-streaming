import type { NextFunction, Request, Response } from "express";
import * as Cookies from "cookies";

export default async function cookies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.cookies = new Cookies(req, res);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: { server: "Server error" } });
  }
}
