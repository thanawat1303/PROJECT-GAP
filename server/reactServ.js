const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const compiler = webpack(config);

const path = require('path');
const dirName = path.resolve(__dirname, "../src/");

module.exports = reactServ = (app) => {
    compiler.hooks.afterEmit.tap("cleanup-the-require-cache", () => {
        Object.keys(require.cache)
        .filter((key) => key.includes(dirName))
        .forEach((key) => delete require.cache[key]);
    });

    // set middleware main path on web
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
        })
    );
    
    app.use(
        webpackHotMiddleware(compiler, {
            log: false,
            path:"/__webpack_hmr",
            heartbeat: 10 * 1000,
        }
        )
    )
    
}

