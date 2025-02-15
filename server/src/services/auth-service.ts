import * as jose from "jose";
import config from "~/config.js";
import User from "~/entities/user.js";

type TokenData = {
  uuid: number;
};

const secret = new TextEncoder().encode(config.jwt.secret);

const alg = "HS256";

const authService = {
  sign(user: User) {
    return new jose.SignJWT({ uuid: user.uuid })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("30d")
      .sign(secret);
  },

  async verify(token: string = "") {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });
    return payload as TokenData;
  },
};

export default authService;
