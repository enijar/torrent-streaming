import type { Request } from "express";
import type { PrivateRequest } from "../types";

export default function paginate(req: Request | PrivateRequest, limit = 50) {
  let page = parseInt(String(req.query?.page ?? 1));
  if (isNaN(page)) {
    page = 1;
  }
  page = Math.max(1, page);
  return { limit, offset: limit * (page - 1) };
}
