import * as path from "path";
import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";
import * as CopyPlugin from "copy-webpack-plugin";

const NodemonPlugin = require("nodemon-webpack-plugin");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const DEV_MODE = process.env.NODE_ENV === "development";
const SRC_DIR = path.resolve(__dirname, "src");
const BUILD_DIR = path.resolve(__dirname, "build");

const config = {
  cache: {
    type: "filesystem",
  },
  mode: DEV_MODE ? "development" : "production",
  target: "node",
  stats: "minimal",
  entry: {
    index: path.join(SRC_DIR, "index.ts"),
    cli: path.join(SRC_DIR, "cli.ts"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.PORT": JSON.stringify(process.env.PORT),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
      "process.env.APP_URL": JSON.stringify(process.env.APP_URL),
      "process.env.CORS_ORIGINS": JSON.stringify(process.env.CORS_ORIGINS),
      "process.env.BCRYPT_ROUNDS": JSON.stringify(process.env.BCRYPT_ROUNDS),
      "process.env.DATABASE_HOST": JSON.stringify(process.env.DATABASE_HOST),
      "process.env.DATABASE_NAME": JSON.stringify(process.env.DATABASE_NAME),
      "process.env.DATABASE_DIALECT": JSON.stringify(
        process.env.DATABASE_DIALECT
      ),
      "process.env.DATABASE_USERNAME": JSON.stringify(
        process.env.DATABASE_USERNAME
      ),
      "process.env.DATABASE_PASSWORD": JSON.stringify(
        process.env.DATABASE_PASSWORD
      ),
      "process.env.DATABASE_STORAGE": JSON.stringify(
        process.env.DATABASE_STORAGE
      ),
      "process.env.JWT_SECRET": JSON.stringify(process.env.JWT_SECRET),
      "process.env.EMAIL_PREVIEW": JSON.stringify(process.env.EMAIL_PREVIEW),
      "process.env.EMAIL_SEND": JSON.stringify(process.env.EMAIL_SEND),
      "process.env.EMAIL_FROM": JSON.stringify(process.env.EMAIL_FROM),
      "process.env.EMAIL_SMTP_HOST": JSON.stringify(
        process.env.EMAIL_SMTP_HOST
      ),
      "process.env.EMAIL_SMTP_PORT": JSON.stringify(
        process.env.EMAIL_SMTP_PORT
      ),
      "process.env.EMAIL_SMTP_USERNAME": JSON.stringify(
        process.env.EMAIL_SMTP_USERNAME
      ),
      "process.env.EMAIL_SMTP_PASSWORD": JSON.stringify(
        process.env.EMAIL_SMTP_PASSWORD
      ),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(SRC_DIR, "emails"),
          to: path.join(BUILD_DIR, "emails"),
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: "[name].js",
    path: BUILD_DIR,
    clean: true,
  },
  externalsPresets: { node: true },
  externals: [nodeExternals(), { sqlite3: "commonjs sqlite3" }],
};

export default () => {
  if (DEV_MODE) {
    config.plugins.push(new NodemonPlugin());
  }
  return config;
};
