import type { Context } from "hono";

export default function paginate(ctx: Context, limit = 50) {
  let page = parseInt(ctx.req.query("page") ?? "1");
  if (isNaN(page) || !isFinite(page)) {
    page = 1;
  }
  page = Math.max(1, page);
  return { limit, offset: limit * (page - 1) };
}
