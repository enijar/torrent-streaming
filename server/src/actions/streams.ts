import { type FindOptions, Op, sql } from "@sequelize/core";
import type { Context } from "hono";
import Stream from "~/entities/stream.js";
import paginate from "~/services/paginate.js";

export default async function streams(ctx: Context) {
  const { limit, offset } = paginate(ctx);
  const q = (ctx.req.query("q") ?? "").trim();

  const query: FindOptions["where"] = {
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

  // Add full-text search if query is provided
  if (q.length > 0) {
    // Use full-text search for better performance with indexed title column
    const escapedQuery = q.replace(/'/g, "''");
    query[Op.and] = [
      sql`MATCH(title) AGAINST(${escapedQuery} IN NATURAL LANGUAGE MODE)`,
    ];
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
