const path = require('path');
require('dotenv').config().parsed

// Hot refresh
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// Hot refresh
module.exports = {
    mode: "development", //set Mode 
    entry:
        {
            admin : ["./index_jsx/admin.js" , "webpack-hot-middleware/client"] , 
            doctor : ["./index_jsx/doctor.js" , "webpack-hot-middleware/client"] , 
            farmer : ["./index_jsx/farmer.js" , "webpack-hot-middleware/client"],
        }, //set file main run react
    output: {
        path: path.resolve(__dirname , "public"), //set path template main index.html
        filename: "[name].main.js", //set file main where build
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
                "process.env.REACT_API_KEY_MAP" : JSON.stringify(process.env.REACT_API_KEY_MAP)
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
                test: /\.(s[ac]ss|css)$/i,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            }
        ],
    },
}