import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { socket } from "~/services/server.js";
import User from "~/entities/user.js";
import config from "~/config.js";
import authService from "~/services/auth-service.js";

export default async function auth(ctx: Context) {
  const loginToken = ctx.req.query("loginToken") ?? "";
  const uuid = ctx.req.query("uuid") ?? "";

  const user = await User.findOne({ where: { loginToken } });

  if (user === null) {
    ctx.status(401);
    return ctx.text("Invalid login token, try to login again");
  }

  await user.update({ loginToken: null });

  const authToken = await authService.sign(user);
  setCookie(ctx, "authToken", authToken);

  // Let the origin client know the authToken
  if (uuid !== "") {
    socket.to(uuid as string).emit("authToken", authToken);
  }

  return ctx.redirect(`${config.appUrl}/streams`);
}
