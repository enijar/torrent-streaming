const path = require("path");

module.exports = {
  apps: [
    {
      name: "server",
      script: path.resolve(__dirname, "build", "index.js"),
    },
  ],
};
