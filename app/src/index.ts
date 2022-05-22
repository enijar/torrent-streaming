import * as path from "path";
import * as express from "express";
import * as puppeteer from "puppeteer";
import { AddressInfo } from "net";

const app = express();
app.use(express.static(path.resolve(__dirname, "..", "..", "client", "build")));

const server = app.listen(0, async () => {
  try {
    const address = server.address() as AddressInfo;
    const { port } = address;
    const browser = await puppeteer.launch({
      headless: false,
      env: {
        GOOGLE_API_KEY: "",
        GOOGLE_DEFAULT_CLIENT_ID: "",
        GOOGLE_DEFAULT_CLIENT_SECRET: "",
      },
      args: [
        "--no-first-run",
        "--no-default-check",
        `--app=http://localhost:${port}`,
      ],
      ignoreDefaultArgs: [
        "--enable-automation",
        "--enable-blink-features=IdleDetection",
      ],
    });

    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();

    browser.on("disconnected", () => {
      server.close();
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    server.close();
    process.exit(1);
  }
});
