import { compare } from "bcrypt";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import config from "~/config.js";
import authService from "~/services/auth-service.js";
import User from "~/entities/user.js";

export default async function loginAdmin(ctx: Context) {
  const { email = "", password = "" } = await ctx.req.json();

  const [emailCorrect, passwordCorrect] = await Promise.all([
    compare(email, config.adminEmail),
    compare(password, config.adminPassword),
  ]);

  if (!(emailCorrect && passwordCorrect)) {
    ctx.status(401);
    return ctx.json({ errors: { server: "Invalid admin email/password" } });
  }

  let user = await User.findOne({ where: { email } });

  if (user === null) {
    ctx.status(401);
    return ctx.json({ errors: { server: "Invalid admin email/password" } });
  }

  setCookie(ctx, "authToken", await authService.sign(user), {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "Lax",
  });

  return ctx.json({ messages: { server: "Logged in" } });
}
