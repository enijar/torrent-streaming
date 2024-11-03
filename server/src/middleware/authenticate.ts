import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { JWSInvalid } from "jose/errors";
import authService from "@/services/auth-service.js";
import User from "@/entities/user.js";

export default function authenticate(fn: (ctx: Context, user: User) => Promise<any>) {
  return async (ctx: Context) => {
    try {
      const authToken = getCookie(ctx, "authToken") ?? "";
      const { uuid = "" } = await authService.verify(authToken);

      const user = await User.findOne({ where: { uuid } });

      if (user === null) {
        ctx.status(401);
        return ctx.json({ errors: { server: "Unauthorised" } });
      } else {
        setCookie(ctx, "authToken", await authService.sign(user));
        return fn(ctx, user);
      }
    } catch (err) {
      if (err instanceof JWSInvalid) {
        ctx.status(401);
        return ctx.json({ errors: { server: "Unauthorised" } });
      } else {
        console.error(err);
        ctx.status(500);
        return ctx.json({ errors: { server: "Server error" } });
      }
    }
  };
}
