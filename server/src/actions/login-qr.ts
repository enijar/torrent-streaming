import type { Context } from "hono";
import config from "@/config.js";

export default async function loginQr(ctx: Context) {
  const uuid = ctx.req.param("uuid") ?? "";
  if (!uuid) {
    return ctx.text("Invalid QR code, try again");
  } else {
    return ctx.redirect(`${config.appUrl}/${uuid}`);
  }
}
