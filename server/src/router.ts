import { Router } from "express";
import authenticate from "./middleware/authenticate";
import login from "./actions/login";
import loginAdmin from "./actions/login-admin";
import loginQr from "./actions/login-qr";
import auth from "./actions/auth";
import loginWithAuthToken from "./actions/login-with-auth-token";
import user from "./actions/user";
import streams from "./actions/streams";
import stream from "./actions/stream";
import watch from "./actions/watch";

const router = Router();

router.post("/api/login", login);
router.post("/api/login/admin", loginAdmin);
router.get("/api/login/qr/:uuid", loginQr);
router.get("/api/auth", auth);
router.post("/api/login-with-auth-token", loginWithAuthToken);
router.get("/api/user", [authenticate], user);
router.get("/api/streams", [authenticate], streams);
router.get("/api/stream/:uuid", [authenticate], stream);
router.get("/api/watch/:uuid", [authenticate], watch);

export default router;
