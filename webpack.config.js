const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: {
    admin : "./index_jsx/admin.js" , 
    doctor : "./index_jsx/doctor.js" ,
    farmer : "./index_jsx/farmer.js",
  },
  output: {
    path: path.resolve(__dirname , "public"), 
    filename: "[name].main.js"
  },
  plugins : [
    new webpack.DefinePlugin({
        "process.env.REACT_API_KEY_MAP" : JSON.stringify(process.env.REACT_API_KEY_MAP)
    })
  ],
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
            }
            }
        },
        {
            test: /\.(s[ac]ss|css)$/i,
            use:[
                "style-loader",
                "css-loader",
                "sass-loader",
            ],
        }
    ]
  }
};
