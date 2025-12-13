import * as path from "node:path";
import { defineConfig, loadEnv, type UserConfigFn } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { config as dotenv } from "dotenv";

dotenv({ path: path.resolve(__dirname, "..", ".env") });

const PROJECT_ROOT = path.resolve(__dirname);
const DEV_MODE = process.env.NODE_ENV === "development";

const config: UserConfigFn = (env) => {
  process.env = { ...process.env, ...loadEnv(env.mode, process.cwd()) };
  return defineConfig({
    server: {
      port: 8900,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: process.env.API_URL,
        },
        "/socket.io": {
          target: process.env.API_URL,
        },
      },
      allowedHosts: (process.env.ALLOWED_HOSTS ?? "").split(","),
    },
    base: "/",
    publicDir: path.join(PROJECT_ROOT, "public"),
    build: {
      outDir: path.join(PROJECT_ROOT, "build"),
      emptyOutDir: true,
    },
    esbuild: {
      legalComments: "none",
    },
    appType: "spa",
    root: "src",
    clearScreen: false,
    plugins: [
      tsconfigPaths(),
      react({
        include: /\.(tsx?)$/,
        babel: {
          plugins: [
            [
              "babel-plugin-styled-components",
              {
                ssr: !DEV_MODE,
                fileName: false,
                displayName: DEV_MODE,
                minify: !DEV_MODE,
                pure: !DEV_MODE,
              },
            ],
          ],
        },
      }),
    ],
  });
};

export default config;
