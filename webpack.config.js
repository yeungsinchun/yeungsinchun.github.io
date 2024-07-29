/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        homepage: "./src/index.jsx",
        connect4: "./src/connect4.jsx",
        dev_diary: "./src/dev_diary.jsx",
    },
    devtool: "inline-source-map",
    devServer: {
        static: "./dist",
        watchFiles: "./src",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "TYeung's homepage",
            template: "src/index.html",
            chunks: ["homepage"],
        }),
        new HtmlWebpackPlugin({
            title: "TYeung's timetable",
            template: "src/timetable.html",
            filename: "timetable.html",
            // add chunk here
        }),
        new HtmlWebpackPlugin({
            title: "TYeung's connect four",
            template: "src/connect4.html",
            filename: "connect4.html",
            chunks: ["connect4"],
        }),
        new HtmlWebpackPlugin({
            title: "TYeung's development diary",
            template: "src/dev_diary.html",
            filename: "dev_diary.html",
            chunks: ["dev_diary"],
        })
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: "style-loader", // inject CSS to page
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS modules
                    },
                    {
                        loader: "postcss-loader", // Run post css actions
                        options: {
                            postcssOptions: {
                                plugins: function () {
                                    // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require("precss"),
                                        require("autoprefixer"),
                                    ];
                                },
                            },
                        },
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                    },
                ],
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: "ts-loader",
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "image/[name][ext]", // development mode
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};

console.log(__dirname);
