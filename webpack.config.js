const path = require('path');

module.exports = {
  entry: '/index.js',
  output: {
    path: path.resolve(__dirname , "public"), 
    filename: 'main.js'
  },
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
            test: /\.s[ac]ss$/i,
            use:[
                "style-loader",
                "css-loader",
                "sass-loader",
            ],
        }
    ]
  }
};
