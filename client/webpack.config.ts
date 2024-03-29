import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as CopyPlugin from "copy-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const DEV_MODE = process.env.NODE_ENV === "development";
const SRC_DIR = path.resolve(__dirname, "src");
const PUBLIC_DIR = path.resolve(__dirname, "public");
const BUILD_DIR = path.resolve(__dirname, "build");
const PUBLIC_PATH = process.env.PUBLIC_PATH ?? "/";

const config = {
  cache: {
    type: "filesystem",
  },
  mode: DEV_MODE ? "development" : "production",
  target: DEV_MODE ? "web" : "browserslist",
  stats: "minimal",
  devtool: DEV_MODE ? "eval-cheap-module-source-map" : "source-map",
  entry: path.join(SRC_DIR, "index.tsx"),
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheCompression: false,
              cacheDirectory: true,
              presets: [
                "@babel/preset-typescript",
                "@babel/preset-react",
                "@babel/preset-env",
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "babel-plugin-macros",
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
                ...(DEV_MODE ? ["react-refresh/babel"] : []),
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: DEV_MODE,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_DIR, "index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: PUBLIC_DIR,
          to: BUILD_DIR,
          globOptions: {
            ignore: [path.join(PUBLIC_DIR, "index.html")],
          },
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin({})],
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].chunk.js",
    path: BUILD_DIR,
    clean: true,
    publicPath: PUBLIC_PATH,
  },
};

export default () => {
  if (!DEV_MODE) {
    config.plugins.push(
      new HtmlInlineScriptPlugin({ scriptMatchPattern: [/main.+[.]js$/] })
    );
  }
  return config;
};
