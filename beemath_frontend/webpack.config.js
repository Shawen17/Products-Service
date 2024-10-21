import { join } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export const output = {
  path: join(__dirname, "/dist"),
  filename: "bundle.js", // the name of the bundle
};
export const plugins = [
  new HtmlWebpackPlugin({
    template: "src/index.html", // to import index.html file inside index.js
  }),
];
export const devServer = {
  port: 3030, // you can change the port
};
export const module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    },
    {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: "url-loader",
      options: { limit: false },
    },
   
  ],
//  resolve:{
//   fallback:
//   {"os":false,
//   "fs":false,
//   "path":false
//   },
//  }
  
};