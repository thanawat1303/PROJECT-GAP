# PROJECT-LINE-OA-GAP React

### Install Project
   - Package-json
      - windows
         ```
         cp .\package-json\package.json . #windows
         ```

      - Linux
         ```
         cp package-json/package.json  . #Linux
         ```

   - Packages
      ```
      npm i express nodemon dotenv cookie-parser express-session helmet mysql mysql2 uuid pm2

      npm i react react-dom resize-observer-polyfill
      
      npm i sass-loader sass css-loader style-loader @pmmmwh/react-refresh-webpack-plugin react-refresh 

      npm i webpack-hot-middleware webpack webpack-cli webpack-dev-server webpack-dev-middleware
      
      npm i html-webpack-plugin babel-loader @babel/preset-env @babel/core @babel/plugin-transform-runtime @babel/preset-react babel-eslint @babel/runtime

      npm i multer

      npm i @line/bot-sdk #api line
      npm i @line/liff

      npm i @google/maps
      npm i @react-google-maps/api  
      npm i google-map-react

      npm i socket.io socket.io-client

      npm i typescript

      npm i exifr

      npm i --save-dev @types/mysql @types/react @types/webpack-hot-middleware @types/webpack @types/cookie-parser @types/express-session @types/multer

      npm i ngrok

      npm i file-saver sheetjs-style

      npm i ts-node

      npm i @react-pdf/renderer
      npm i jspdf jspdf-autotable
      npm i wordcut thai-wordcut

      npm i axios

      npm i thaidatepicker-react
      ```

   - Init env
      ```
      npm run init-env
      ```
      or
      ```
      node InitEnv/setupEnv.js
      ```

   - Install Database
      - SQL/main/Structure Database.sql
      - setup user admin
        ```
        INSERT INTO `admin` (username , password , phone , address) VALUES ('--username--' , SHA2('--password--', 256) , '--number phone--' , POINT(0000 , 0000))
        ```

### Build Project

   - After install packages and .env
      ```
      npm run build
      ```
   
### Start Server

   - Development
      - First step , start host of application by ngrok
         ```
         npm run server-ngrok
         ```
      - Next step , start application
         ```
         npm run server-dev
         ```
   
   - Product pm2
      - start
         ```
         npm run server 'username-db' 'password-db'
         ```
      - restart
         ```
         npm run server-restart
         ```
      - stop
         ```
         npm run server-stop
         ```
   
   - Product Foreground
      ```
      npm run server-node 'username-db' 'password-db'
      ```

### Tool and Technical
   - Fontend
      - React library
      - Google maps API
      - Scss
   - Backend
      - Expressjs
      - Web-socket
      - Bot-line-SDK
      - SQL
   - Tool 
      - LINE Bot Designer

mklink /D .\assets\ .\node_modules\
ln -s .\assets\ .\node_modules\