const path = require("path");
const webpack = require("webpack");

module.exports = {
   entry: "./src/index.js",
   mode: "development",
   module: {
      rules: [
         {
         test: /\.(js|jsx)$/,
         exclude: /(node_modules|bower_components)/,
         loader: "babel-loader",
         options: { presets: ["@babel/env"] }
         },
         {
         test: /\.css$/,
         use: ["style-loader", "css-loader"]
         }
      ]
   },
   resolve: { extensions: ["*", ".js", ".jsx"] },
   output: {
      path: path.resolve(__dirname, "dev"),
      publicPath: "dev/",
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js"
   },
   devServer: {
      contentBase: path.resolve(__dirname, "dev"),
      port: 3000,
      publicPath: "http://localhost:3000",
      hotOnly: true
   },
   plugins: [new webpack.HotModuleReplacementPlugin()],
   optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
};