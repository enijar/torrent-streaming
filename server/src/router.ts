import { Router } from "express";
import authenticate from "./middleware/authenticate";
import login from "./actions/login";
import auth from "./actions/auth";
import user from "./actions/user";
import streams from "./actions/streams";
import search from "./actions/search";
import stream from "./actions/stream";
import watch from "./actions/watch";

const router = Router();

router.post("/api/login", login);
router.get("/api/auth", auth);
router.get("/api/user", [authenticate], user);
router.get("/api/streams", [authenticate], streams);
router.get("/api/search", [authenticate], search);
router.get("/api/stream/:uuid", [authenticate], stream);
router.get("/api/watch/:uuid", [authenticate], watch);

export default router;
