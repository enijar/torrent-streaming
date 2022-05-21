import type { Response } from "express";
import type { PrivateRequest } from "../types";

export default async function streams(req: PrivateRequest, res: Response) {
  res.json({
    data: [
      {
        title: "Test",
      },
    ],
  });
}
