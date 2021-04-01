const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [
            {
                /** Load & Transpile ES6 syntax for .js and .jsx files */
                test: /\.(js|jsx)$/i, // "/i => case insensitive"
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/env", "@babel/react"],
                    plugins: [
                        [
                            "babel-plugin-styled-components",
                            { displayName: true },
                        ],
                        "@babel/plugin-proposal-class-properties",
                    ],
                },
            },
            {
                /** Load & Compile SCSS and SASS files to CSS */
                test: /\.s(a|c)ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                /** Load & Transpile CSS */
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                /** Load all other files/images */
                test: /\.(png|jpg|jfif|gif|svg|eot|ttf|woff|woff2|json|xml|ico)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                    publicPath: "/",
                },
            },
        ],
    },
    resolve: {
        extensions: [
            "*",
            ".js",
            ".jsx",
        ],
    },
};
