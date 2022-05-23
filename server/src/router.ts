import { Router } from "express";
import authenticate from "./middleware/authenticate";
import login from "./actions/login";
import auth from "./actions/auth";
import user from "./actions/user";
import streams from "./actions/streams";
import stream from "./actions/stream";

const router = Router();

router.post("/api/login", login);
router.get("/api/auth", auth);
router.get("/api/user", [authenticate], user);
router.get("/api/streams", [authenticate], streams);
router.get("/api/stream/:uuid", [authenticate], stream);

export default router;
