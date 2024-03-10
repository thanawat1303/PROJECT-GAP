'use strict';

const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';
  return {
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    // Note: ["localhost", ".localhost"] will support subdomains - but we might
    // want to allow setting the allowedHosts manually for more complex setups
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    // Enable gzip compression of generated files.
    compress: true,
    static: [
      {
        directory: paths.appStatic.public,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
      {
        directory: paths.appStatic.style,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
      {
        directory: paths.appStatic.js,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
      {
        directory: paths.appStatic.icon,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
      {
        directory: paths.appStatic.img,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
      {
        directory: paths.appStatic.font,
        publicPath: [paths.publicUrlOrPath],
        watch: {
          ignored: ignoredFiles(paths.appSrc),
        },
      },
    ],
    client: {
      webSocketURL: {
        // Enable custom sockjs pathname for websocket connection to hot reloading server.
        // Enable custom sockjs hostname, pathname and port for websocket connection
        // to hot reloading server.
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      // It is important to tell WebpackDevServer to use the same "publicPath" path as
      // we specified in the webpack config. When homepage is '.', default to serving
      // from the root.
      // remove last slash so user can land on `/test` instead of `/test/`
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    https: getHttpsConfig(),
    host,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
    proxy,
    onBeforeSetupMiddleware(devServer) {
      // Keep `evalSourceMapMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
