import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export default async function loginWithAuthToken(ctx: Context) {
  const { authToken = "" } = await ctx.req.json();

  if (authToken === "") {
    ctx.status(401);
    return ctx.json({ errors: { server: "Unauthorised" } });
  }

  setCookie(ctx, "authToken", authToken);

  return ctx.json({ messages: { server: "Authorised" } });
}
