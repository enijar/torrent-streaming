import { Router } from "express";
import authenticate from "./middleware/authenticate";
import login from "./actions/login";
import loginAdmin from "./actions/login-admin";
import auth from "./actions/auth";
import user from "./actions/user";
import streams from "./actions/streams";
import stream from "./actions/stream";
import watch from "./actions/watch";

const router = Router();

router.post("/api/login", login);
router.post("/api/login/admin", loginAdmin);
router.get("/api/auth", auth);
router.get("/api/user", [authenticate], user);
router.get("/api/streams", [authenticate], streams);
router.get("/api/stream/:uuid", [authenticate], stream);
router.get("/api/watch/:uuid", [authenticate], watch);

export default router;
