const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const _config = require('../webpack.dev.config');
const path = require('path');

module.exports = function reactServ(app) {
    const WebpackConfig = _config 
    // as Configuration
    const compiler = webpack(WebpackConfig);
    const dirName = path.resolve(__dirname, "../src/");
    
    compiler.hooks.afterEmit.tap("cleanup-the-require-cache", () => {
        Object.keys(require.cache)
        .filter((key) => key.includes(dirName))
        .forEach((key) => delete require.cache[key]);
    });

    // set middleware main path on web
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: _config.output.publicPath,
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

