import type { Request } from "express";
import type User from "./entities/user";

export type PrivateRequest = Request & {
  user: User;
};
