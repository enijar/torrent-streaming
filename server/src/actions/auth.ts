import type { Request, Response } from "express";
import { socket } from "../services/app";
import User from "../entities/user";
import config from "../config";
import authService from "../services/auth-service";

export default async function auth(req: Request, res: Response) {
  const { loginToken = "", uuid = "" } = req.query;

  const user = await User.findOne({ where: { loginToken } });

  if (user === null) {
    return res.status(401).send("Invalid login token, try to login again");
  }

  await user.update({ loginToken: null });

  const authToken = authService.sign(user);
  req.cookies.set("authToken", authToken);

  // Let the origin client know the authToken
  if (uuid !== "") {
    socket.to(uuid as string).emit("authToken", authToken);
  }

  res.redirect(`${config.appUrl}/streams`);
}
