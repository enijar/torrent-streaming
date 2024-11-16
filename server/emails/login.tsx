import React from "react";
import { Button, Html, Img, Text } from "@react-email/components";
import config from "@/config.js";

type Props = {
  loginToken: string;
  uuid: string;
};

export default function Login(props: Props) {
  return (
    <Html lang="en">
      <Text>
        <Img src={`${config.appUrl}/preview.png`} alt="All the Streams" />
      </Text>
      <Text>
        <Button href={`${config.apiUrl}/api/auth?loginToken=${props.loginToken}&uuid=${props.uuid}`}>
          Click here to login
        </Button>
      </Text>
      <Text>
        If the link above doesn't work, copy/paste this into your browser URL bar:
        <br />
        {`${config.apiUrl}/api/auth?loginToken=${props.loginToken}&uuid=${props.uuid}`}
      </Text>
    </Html>
  );
}
