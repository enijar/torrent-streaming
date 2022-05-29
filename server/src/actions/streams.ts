import type { Response } from "express";
import { FindOptions, Op } from "sequelize";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import paginate from "../services/paginate";

export default async function streams(req: PrivateRequest, res: Response) {
  const { limit, offset } = paginate(req);
  const q = String(req.query?.q ?? "").trim();

  let query: FindOptions["where"] = undefined;

  if (q.length > 0) {
    query = {
      title: {
        [Op.like]: `%${q.replace(/\s+/g, "%")}%`,
      },
    };
  }

  const streams = await Stream.findAll({
    where: query,
    order: [
      ["rating", "desc"],
      ["createdAt", "asc"],
    ],
    limit,
    offset,
  });

  res.json({ data: { streams } });
}
