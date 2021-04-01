/** dotenv config setup for loading secret environment variables */
const Dotenv = require("dotenv-webpack");
const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    /** Fix DevTools SourceMapping load failures */
    devtool: "eval-source-map",
    output: {
        /** webpack-dev-server bundles the file in-memory */
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/",
        filename: "main.bundle.js",
    },
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        port: process.env.DEV_PORT || 3000,
        publicPath: "/",
        hotOnly: true,
        /** Configuration to allow React Router to work */
        historyApiFallback: true,
        proxy: {
            "/api/**": {
                target: `http://localhost:${process.env.SERVER_PORT || 9000}`,
                secure: false,
                changeOrigin: true,
            },
        },
    },
    plugins: [
        /** Enable hot loading for react-hot-loader */
        new webpack.HotModuleReplacementPlugin(),
        /** Define dotenv plugin for process.env */
        new Dotenv(),
        /** Generate a dynamic index.html for the dev server */
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "./public/index.html"),
            inject: true,
        }),
    ],
    resolve: {
        extensions: [
            "*",
            ".js",
            ".jsx",
        ],
        alias: {
            /** Replace react-dom with @hot-loader/react-dom */
            "react-dom": "@hot-loader/react-dom",
        },
    },
});
