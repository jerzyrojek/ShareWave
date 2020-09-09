const path = require("path");
const webpack = require("webpack");
const entryPath = "App";
const entryFile = "index.js"
const dotenv = require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
    entry: ["whatwg-fetch", `./${entryPath}/js/${entryFile}`],
    output: {
        filename: "out.js",
        path: path.resolve(__dirname, `${entryPath}/build`)
    },
    devServer: {
        contentBase: path.join(__dirname, `${entryPath}`),
        publicPath: "/build/",
        compress: true,
        port: 3001,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
    ]
};
