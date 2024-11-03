import { randomBytes } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { compare } from "bcrypt";
import type { Context } from "hono";
import mail from "@/services/mail.js";
import config from "@/config.js";
import User from "@/entities/user.js";

export default async function login(ctx: Context) {
  const { email = "", uuid = "" } = await ctx.req.json();

  const authorisedEmailsFile = path.join(config.paths.data, "authorised-emails.json");

  const authorisedEmails = JSON.parse(await fs.readFile(authorisedEmailsFile, "utf-8"));

  const hashResults = await Promise.all(
    authorisedEmails.map((authorisedEmail: string) => {
      return compare(email, authorisedEmail);
    }),
  );

  const emailIsAuthorised = hashResults.includes(true);

  if (!emailIsAuthorised) {
    ctx.status(401);
    return ctx.json({ errors: { server: "Your email is not authorised to login" } });
  }

  let user = await User.findOne({ where: { email } });

  if (user === null) {
    const loginToken = randomBytes(48).toString("hex");
    user = await User.create({ email, loginToken });
  }

  if (user.loginToken === null) {
    const loginToken = randomBytes(48).toString("hex");
    user = await user.update({ loginToken });
  }

  await mail.send({
    template: "login",
    message: {
      subject: "Torrent Streaming Login",
      to: email,
    },
    locals: { loginToken: user.loginToken, uuid, config },
  });

  return ctx.json({ messages: { server: "We've sent the login link to your email" } });
}
