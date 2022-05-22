import type { Request } from "express";
import type User from "./entities/user";

export type PrivateRequest = Request & {
  user: User;
};

export type Torrent = {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: number;
};
