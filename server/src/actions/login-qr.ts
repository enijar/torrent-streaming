import type { Request, Response } from "express";
import config from "../config";

export default async function loginQr(req: Request, res: Response) {
  const { uuid } = req.params;
  if (!uuid) {
    return res.send("Invalid QR code, try again");
  }
  res.redirect(`${config.appUrl}/${uuid}`);
}
