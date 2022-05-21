import type { Request, Response } from "express";
import User from "../entities/user";
import config from "../config";
import authService from "../services/auth-service";

export default async function auth(req: Request, res: Response) {
  const { loginToken = "" } = req.query;

  const user = await User.findOne({ where: { loginToken } });

  if (user === null) {
    return res.status(401).send("Invalid login token, try to login again");
  }

  await user.update({ loginToken: null });

  req.cookies.set("authToken", authService.sign(user));

  res.redirect(`${config.appUrl}/streams`);
}
