const path = require("path");
module.exports = {
  devtool: "eval-source-map",
  mode: "development",
  entry: "./src/ts/main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    publicPath: "Js",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/Js"),
  },
};
