import type { Response } from "express";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";

export default async function stream(req: PrivateRequest, res: Response) {
  const { uuid } = req.params ?? {};
  const stream = await Stream.findByPk(uuid);

  if (stream === null) {
    return res.status(404).json({ errors: { server: "Stream not found" } });
  }

  res.json({ data: { stream } });
}
