import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { socket } from "~/services/server.js";
import type User from "~/entities/user.js";

export default async function user(ctx: Context, user: User) {
  const uuid = ctx.req.query("uuid") ?? "";
  // Let the origin client know the authToken
  if (uuid !== "") {
    const authToken = getCookie(ctx, "authToken") ?? "";
    socket.to(uuid as string).emit("authToken", authToken);
  }
  return ctx.json({ data: user });
}
