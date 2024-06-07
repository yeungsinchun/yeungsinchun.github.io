const path = require("path");

module.exports = {
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};

console.log(__dirname);
