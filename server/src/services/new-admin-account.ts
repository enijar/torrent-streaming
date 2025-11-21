import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { hash } from "bcrypt";
import config from "~/config.js";

export default async function newAdminAccount(email: string, password: string) {
  const parsed = z
    .object({
      email: z.email().nonempty(),
      password: z.string().nonempty(),
    })
    .safeParse({ email, password });
  if (!parsed.success) {
    throw new Error("Enter and email and password for the new admin");
  }
  // await User.create({ email });
  const newConfigSource = (await fs.promises.readFile(path.join(import.meta.dirname, "..", "config.ts"), "utf-8"))
    .replace(/adminEmail: ".*"/, `adminEmail: "${await hash(email, config.bcryptRounds)}"`)
    .replace(/adminPassword: ".*"/, `adminPassword: "${await hash(password, config.bcryptRounds)}"`);
  await fs.promises.writeFile(path.join(import.meta.dirname, "..", "config.ts"), newConfigSource);
}
