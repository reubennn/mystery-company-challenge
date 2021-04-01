const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const dotenv = require("dotenv");

/** Plugins */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "./dist/"),
        publicPath: "/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
    },
    optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    minChunks: 2,
                    chunks: "async",
                    priority: 10,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    priority: 20,
                },
            },
        },
    },
    plugins: [
        /** Copy files from public directory to dist directory */
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, "public/"),
                to: path.join(__dirname, "./dist"),
                globOptions: {
                    ignore: [
                        "**/index.html",
                        "**/assets/**/*",
                    ],
                },
            }],
        }),
        /** Ignore the react-hot-loader dependency */
        new webpack.IgnorePlugin(/react-hot-loader/),
        /** Generate a dynamic index.html based on the one we created */
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "./public/index.html"),
            inject: true,
            chunks: "all",
        }),
        /** Use compression Algorithm by package designed by Google (Brotli) */
        new BrotliPlugin({
            asset: "[path].br[query]",
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        /** gzip compression fallback */
        new CompressionPlugin({
            filename: "[name].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        /** Use to visualize the bundle to analyze and optimize */
        // new BundleAnalyzerPlugin(),
    ],
});
