import React from "react";
import { render } from "@react-email/components";
import sendgrid from "@sendgrid/mail";
import config from "~/config.js";

sendgrid.setApiKey(config.email.password);

type SendOptions = {
  subject: string;
  to: string;
  from?: string;
};

const mail = {
  async send(template: React.ReactElement, options: SendOptions) {
    return sendgrid.send({
      from: options.from ?? config.email.from,
      to: options.to,
      subject: options.subject,
      html: await render(template),
    });
  },
};

export default mail;
