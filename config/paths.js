'use strict';

const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

const buildPath = process.env.BUILD_PATH || 'build' + "/" + process.argv[2];

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('app'),
  appBuild: resolveApp(buildPath),

  appStatic: {
    public : resolveApp(`app/public/${process.argv[2]}`),
    style : resolveApp('app/src/assets/style'),
    js : resolveApp('app/src/assets/js'),
    img : resolveApp('app/src/assets/Img'),
    icon : resolveApp('app/src/assets/Icon'),
    font : resolveApp('app/src/assets/Font')
  },
  
  appHtml: resolveApp(`app/public/${process.argv[2]}/index.html`),
  appIndexJs: resolveModule(resolveApp, `app/src/web/${process.argv[2]}/index`),

  appPackageJson: resolveApp('app/package.json'),
  appSrc: resolveApp('app/src'),
  appTsConfig: resolveApp('app/tsconfig.json'),
  appJsConfig: resolveApp('app/jsconfig.json'),
  yarnLockFile: resolveApp('app/yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'app/src/setupTests'),
  proxySetup: resolveApp('app/src/setupProxy.js'),
  appNodeModules: resolveApp('app/node_modules'),
  appWebpackCache: resolveApp('app/node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('app/node_modules/.cache/tsconfig.tsbuildinfo'),
  swSrc: resolveModule(resolveApp, 'app/src/service-worker'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
