import type { Response } from "express";
import type { PrivateRequest } from "../types";

export default async function user(req: PrivateRequest, res: Response) {
  res.json({ data: req.user });
}
