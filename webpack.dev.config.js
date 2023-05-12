const path = require('path');
require('dotenv').config().parsed

// Hot refresh
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDevMode = process.env.NODE_ENV === "development";

const plugins = isDevMode ? 
                    [ // Hot refresh
                        new webpack.HotModuleReplacementPlugin(), //module change hot refresh webpack
                        new ReactRefreshWebpackPlugin({ //module react refresh
                            overlay: {
                                sockIntegration: "whm",
                            },
                        }), 
                        new webpack.DefinePlugin({
                            "process.env.REACT_API_KEY" : JSON.stringify("AIzaSyDgCfVBI9YfvOp1esw8dnuPTtNOpr9YgI4")
                        })
                    ] : [ //not hot refresh
                        ];
// Hot refresh
module.exports = {
    mode: "development", //set Mode 
    entry: ["webpack-hot-middleware/client", "/index.js"], //set file main run react
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
                        plugins: ["react-refresh/babel"], //use babel react refresh
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