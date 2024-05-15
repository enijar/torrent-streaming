import type { Response } from "express";
import { FindOptions, Op, fn } from "sequelize";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import paginate from "../services/paginate";

export default async function streams(req: PrivateRequest, res: Response) {
  const { limit, offset } = paginate(req);
  const q = String(req.query?.q ?? "").trim();

  let query: FindOptions["where"] = {
    year: {
      [Op.lte]: fn(`year(now())`),
    },
    rating: {
      [Op.gt]: 0,
    },
    seeds: {
      [Op.gt]: 0,
    },
  };

  if (q.length > 0) {
    query = {
      title: {
        [Op.like]: `%${q.replace(/\s+/g, "%")}%`,
      },
    };
  }

  const order: FindOptions["order"] = [
    ["year", "desc"],
    ["rating", "desc"],
    ["seeds", "desc"],
  ];

  const streams = await Stream.findAll({
    attributes: ["uuid", "title", "year", "rating", "largeCoverImage"],
    where: query,
    order,
    limit,
    offset,
  });

  res.json({ data: { streams } });
}
