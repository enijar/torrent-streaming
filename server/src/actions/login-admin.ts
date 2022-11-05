import type { Request, Response } from "express";
import { compare } from "bcrypt";
import config from "../config";
import User from "../entities/user";
import authService from "../services/auth-service";

export default async function loginAdmin(req: Request, res: Response) {
  const { email = "", password = "" } = req.body;

  const [emailCorrect, passwordCorrect] = await Promise.all([
    compare(email, config.adminEmail),
    compare(password, config.adminPassword),
  ]);

  if (!(emailCorrect && passwordCorrect)) {
    return res
      .status(401)
      .json({ errors: { server: "Invalid admin email/password" }});
  }

  let user = await User.findOne({ where: { email } });

  if (user === null) {
    return res
      .status(401)
      .json({ errors: { server: "Invalid admin email/password" }});
  }

  req.cookies.set("authToken", authService.sign(user));

  res.json({ messages: { server: "Logged in" }});
}
