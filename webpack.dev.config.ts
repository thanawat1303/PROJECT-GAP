import path from 'path';
require('dotenv').config().parsed

// Hot refresh
import webpack from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

// Hot refresh
export const _config = {
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
        port: process.env.PORT ?? 8000,
        static: "./public",
        open: true,
        hot: true,
        liveReload: true,
    },
    plugins : [ // Hot refresh
            new webpack.HotModuleReplacementPlugin(), //module change hot refresh webpack
            new ReactRefreshWebpackPlugin({ //module react refresh
                overlay: {
                    sockIntegration: "whm",
                },
            }), 
            new webpack.DefinePlugin({
                "process.env.REACT_API_KEY" : JSON.stringify("AIzaSyDgCfVBI9YfvOp1esw8dnuPTtNOpr9YgI4")
            })
    ] ,
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