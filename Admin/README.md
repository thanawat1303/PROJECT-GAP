# React and Express
- Start server
  ```
  npm run server
  ```
## Libary by NodeJS
### main
 - init 
   ```
   npm init -y
   ```

 - Server API 
   ```     
   npm i express nodemon dotenv webpack-dev-middleware cookie-parser express-session 

   npm i helmet
   ```

   - Ref session
     - https://kokdev.com/memory/nodejs-session-cookie/

 - mysql
   
   ```
   npm i mysql
   ```

 - UUID
    ```
    npm install uuid
    ```

 - Client

   ```
   npm i react react-dom
   ```

   - style
     ```
     npm i sass-loader sass #website can read scss to sss 
     npm i css-loader #website can read css
     npm i style-loader #website can read attribute in css or style in css
     ```
     - Ref
       - https://webpack.js.org/loaders/sass-loader/

   - react-refresh
     ```
     npm i @pmmmwh/react-refresh-webpack-plugin react-refresh webpack-hot-middleware
     ```
     - Ref
       - https://github.com/adbutterfield/fast-refresh-express

 - Build-dev
   ```
   npm install webpack webpack-cli webpack-dev-server
   npm i html-webpack-plugin
   npm i babel-loader @babel/preset-env @babel/core @babel/plugin-transform-runtime @babel/preset-react babel-eslint @babel/runtime
   ```

 - tool server
   ```
   npm i pm2
   ```

## Nodemon config in package.json
  - focus server reload
    ```
    "nodemonConfig": {
      "watch" : [
        "server",
        "webpack.config.js"
      ],
      "ignore" : [
        "/src"
      ],
      "delay": "1"
    }
    ```

### Responsive
    - https://www.hobo-web.co.uk/best-screen-size/

## Referrent 
- https://webpack.js.org/guides/development/
- https://www.youtube.com/watch?v=mB1TKceLzh0
- https://webpack.js.org/concepts/plugins/
- https://www.pluralsight.com/guides/how-to-execute-javascript-after-react.js-render-method-has-completed