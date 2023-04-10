import type { Request, Response } from "express";

export default async function loginWithAuthToken(req: Request, res: Response) {
  const { authToken = "" } = req.body;

  if (authToken === "") {
    return res.status(401).json({ errors: { server: "Unauthorised" } });
  }

  req.cookies.set("authToken", authToken);

  res.json({ messages: { server: "Authorised" } });
}
