import { sign, verify } from "jsonwebtoken";
import config from "../config";
import User from "../entities/user";

type TokenData = {
  uuid: number;
};

const authService = {
  sign(user: User) {
    return sign({ uuid: user.uuid }, config.jwt.secret, { expiresIn: "30d" });
  },

  verify(token: string = ""): TokenData {
    // @ts-ignore
    return verify(token, config.jwt.secret);
  },
};

export default authService;
