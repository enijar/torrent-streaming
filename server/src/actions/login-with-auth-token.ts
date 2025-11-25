import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export default async function loginWithAuthToken(ctx: Context) {
  const { authToken = "" } = await ctx.req.json();

  if (authToken === "") {
    ctx.status(401);
    return ctx.json({ errors: { server: "Unauthorised" } });
  }

  setCookie(ctx, "authToken", authToken, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "Lax",
  });

  return ctx.json({ messages: { server: "Authorised" } });
}
