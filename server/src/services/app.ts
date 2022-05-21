import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";
import config from "../config";
import router from "../router";
import cookies from "../middleware/cookies";

const app = express();

app.use(json());
app.use(
  cors({
    origin(origin, next) {
      if (origin && !config.corsOrigins.includes(origin)) {
        return next(new Error("Not allowed by CORS"));
      }
      next(null, true);
    },
    credentials: true,
  })
);
app.use([cookies, router]);

app.all("*", (req, res) => {
  res.status(404).json({ errors: { server: "Not found" } });
});

export default app;
