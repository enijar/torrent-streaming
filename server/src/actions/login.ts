import { randomBytes } from "crypto";
import * as fs from "fs/promises";
import * as path from "path";
import type { Request, Response } from "express";
import { compare } from "bcrypt";
import mail from "../services/mail";
import config from "../config";
import User from "../entities/user";

export default async function login(req: Request, res: Response) {
  const { email = "" } = req.body;

  const authorisedEmailsFile = path.join(
    config.paths.data,
    "authorised-emails.json"
  );

  const authorisedEmails = JSON.parse(
    await fs.readFile(authorisedEmailsFile, "utf-8")
  );

  const hashResults = await Promise.all(
    authorisedEmails.map((authorisedEmail: string) => {
      return compare(email, authorisedEmail);
    })
  );

  const emailIsAuthorised = hashResults.includes(true);

  if (!emailIsAuthorised) {
    return res
      .status(401)
      .json({ errors: { server: "Your email is not authorised to login" } });
  }

  let user = await User.findOne({ where: { email } });

  if (user === null) {
    const loginToken = randomBytes(48).toString("hex");
    user = await User.create({ email, loginToken });
  }

  await mail.send({
    template: "login",
    message: {
      subject: "Torrent Streaming Login",
      to: email,
    },
    locals: { loginToken: user.loginToken, config },
  });

  res.json({ messages: { server: "We've sent the login link to your email" } });
}
