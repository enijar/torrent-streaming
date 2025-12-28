import { type FindOptions, Op, sql } from "@sequelize/core";
import type { Context } from "hono";
import Stream from "~/entities/stream.js";
import paginate from "~/services/paginate.js";

export default async function streams(ctx: Context) {
  const { limit, offset } = paginate(ctx);
  const q = (ctx.req.query("q") ?? "").trim();

  let query: FindOptions["where"] = {
    year: {
      [Op.lte]: new Date().getFullYear(),
    },
    rating: {
      [Op.gt]: 0,
    },
    seeds: {
      [Op.gt]: 0,
    },
    // [Op.and]: ["Documentary", "Music", "Comedy", "Sport", "Reality-TV", "Musical"].map((genre) =>
    //   sql.where(sql.fn("json_contains", sql.col("genres"), JSON.stringify(genre)), 0),
    // ),
  };

  if (q.length > 0) {
    query = {
      title: {
        [Op.like]: `%${q.replace(/\s+/g, "%")}%`,
      },
    };
  }

  const order: FindOptions["order"] = [
    ["seeds", "desc"],
    ["rating", "desc"],
    ["year", "desc"],
    // ["year", "desc"],
    // ["rating", "desc"],
    // ["seeds", "desc"],
  ];

  const streams = await Stream.findAll({
    attributes: ["uuid", "title", "year", "rating", "largeCoverImage"],
    where: query,
    order,
    limit,
    offset,
  });

  return ctx.json({ data: { streams: streams } });
}
