import { Router } from "express";
import login from "./actions/login";
import auth from "./actions/auth";

const router = Router();

router.post("/api/login", login);
router.get("/api/auth", auth);

export default router;
