import { compare, hash } from "bcrypt";
import * as path from "path";
import * as fs from "fs/promises";
import config from "../config";
import * as authorisedEmails from "../../data/authorised-emails.json";

export default async function addAuthorisedEmail(email: string) {
  // Validate
  if (email.length === 0) {
    throw new Error("Enter your email");
  }
  if (!email.includes("@") || !email.match(/\..*$/)) {
    throw new Error("Enter a valid email");
  }

  const authorisedEmail = await hash(email, config.bcryptRounds);

  const hashResults = await Promise.all(
    authorisedEmails.map((authorisedEmail) => {
      return compare(email, authorisedEmail);
    })
  );

  // Don't add hashed email if it's already been added
  const emailIsAuthorised = hashResults.includes(true);

  if (emailIsAuthorised) {
    throw new Error("Email has already been added");
  }

  const authorisedEmailsFile = path.join(
    config.paths.data,
    "authorised-emails.json"
  );

  // Add authorised email to list
  const data = JSON.parse(await fs.readFile(authorisedEmailsFile, "utf-8"));
  await fs.writeFile(
    authorisedEmailsFile,
    JSON.stringify([...data, authorisedEmail], null, 2),
    "utf-8"
  );
}
