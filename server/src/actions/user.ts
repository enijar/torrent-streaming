import type { Response } from "express";
import type { PrivateRequest } from "../types";
import { socket } from "../services/app";

export default async function user(req: PrivateRequest, res: Response) {
  const { uuid = "" } = req.query;
  // Let the origin client know the authToken
  if (uuid !== "") {
    const authToken = req.cookies.get("authToken");
    socket.to(uuid as string).emit("authToken", authToken);
  }
  res.json({ data: req.user });
}
