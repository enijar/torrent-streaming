import { compare, hash } from "bcrypt";
import * as path from "path";
import * as fs from "fs/promises";
import config from "../config";
import * as authorisedEmails from "../../data/authorised-emails.json";

(async () => {
  try {
    // Sanitise
    let [, , email] = process.argv;
    email = email.trim();

    // Validate
    if (email.length === 0) {
      console.error("Enter your email");
      process.exit(1);
    }
    if (!email.includes("@") || !email.match(/\..*$/)) {
      console.error("Enter a valid email");
      process.exit(1);
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
      console.error("Email has already been added");
      process.exit(1);
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

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
