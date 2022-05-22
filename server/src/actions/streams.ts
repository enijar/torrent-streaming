import type { Response } from "express";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";

export default async function streams(req: PrivateRequest, res: Response) {
  let page = parseInt(String(req.query?.page ?? 1));
  if (isNaN(page)) {
    page = 1;
  }
  page = Math.max(1, page);
  const limit = 50;
  const streams = await Stream.findAll({
    order: [
      ["rating", "desc"],
      ["createdAt", "asc"],
    ],
    limit,
    offset: limit * (page - 1),
  });

  res.json({ data: { streams } });
}
