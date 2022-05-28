import type { Response } from "express";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import paginate from "../services/paginate";

export default async function search(req: PrivateRequest, res: Response) {
  const { limit, offset } = paginate(req);
  const q = String(req.query?.q ?? "").trim();

  const streams = await Stream.findAll({
    where: { title: q },
    limit,
    offset,
  });

  res.json({ data: { streams } });
}
