import * as path from "node:path";
import { defineConfig, loadEnv, type UserConfigFn } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const PROJECT_ROOT = path.resolve(__dirname);
const DEV_MODE = process.env.NODE_ENV === "development";
const SERVER_URL = "http://0.0.0.0:3900";

const config: UserConfigFn = (env) => {
  process.env = { ...process.env, ...loadEnv(env.mode, process.cwd()) };
  return defineConfig({
    server: {
      port: 8900,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: SERVER_URL,
        },
        "/socket.io": {
          target: SERVER_URL,
        },
      },
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
