const path = require('path');
require('dotenv').config().parsed

// Hot refresh
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDevMode = process.env.NODE_ENV === "development";

const main = isDevMode
                ? ["webpack-hot-middleware/client", "/index.js"]
                : ["/index.js"]
const jsPlugins = isDevMode ? ["react-refresh/babel"] : []; //use babel react refresh

const plugins = isDevMode ? 
                    [ // Hot refresh
                        new webpack.HotModuleReplacementPlugin(), //module change hot refresh webpack
                        new ReactRefreshWebpackPlugin({ //module react refresh
                            overlay: {
                                sockIntegration: "whm",
                            },
                        }), 
                    ] : [ //not hot refresh
                        ];
// Hot refresh
module.exports = {
    mode: isDevMode ? "development" : "production", //set Mode 
    entry: main, //set file main run react
    output: {
        path: path.resolve(__dirname , "public"), //set path template main index.html
        filename: "main.js", //set file main where build
        publicPath: '/', //set Path Project
    },

    target: "web",
    devtool: 'inline-source-map',
    devServer: {
        port: process.env.PORT,
        static: "./public",
        open: true,
        hot: true,
        liveReload: true,
    },
    plugins,
    resolve: {
        extensions: [".js" , ".jsx" , ".json"],
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: jsPlugins,
                    },
                }, 
            },
            {
                test: /\.s[ac]ss$/i,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            }
        ],
    },
}