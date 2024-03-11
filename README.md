# PROJECT-LINE-OA-GAP React

### Install Project
   - Install Package
      ```
      npm install
      ```

   - Init env
      ```
      npm run init-env
      ```
      or
      ```
      node InitEnv/setupEnv.js
      ```

   - Packages list
      ```
      "@babel/core": "^7.16.0",
      "@google/maps": "^1.1.3",
      "@line/bot-sdk": "^9.0.0",
      "@line/liff": "^2.23.2",
      "@pmmmwh/react-refresh-webpack-plugin": "^0.5.3",
      "@react-google-maps/api": "^2.19.3",
      "@react-pdf/renderer": "^3.3.8",
      "@svgr/webpack": "^5.5.0",
      "@testing-library/jest-dom": "^5.17.0",
      "@testing-library/react": "^13.4.0",
      "@testing-library/user-event": "^13.5.0",
      "axios": "^1.6.7",
      "babel-jest": "^27.4.2",
      "babel-loader": "^8.2.3",
      "babel-plugin-named-asset-import": "^0.3.8",
      "babel-preset-react-app": "^10.0.1",
      "bfj": "^7.0.2",
      "browserslist": "^4.18.1",
      "camelcase": "^6.2.1",
      "case-sensitive-paths-webpack-plugin": "^2.4.0",
      "cookie-parser": "^1.4.6",
      "css-loader": "^6.5.1",
      "css-minimizer-webpack-plugin": "^3.2.0",
      "dotenv": "^10.0.0",
      "dotenv-expand": "^5.1.0",
      "eslint": "^8.3.0",
      "eslint-config-react-app": "^7.0.1",
      "eslint-webpack-plugin": "^3.1.1",
      "exifr": "^7.1.3",
      "express": "^4.18.3",
      "express-session": "^1.18.0",
      "file-loader": "^6.2.0",
      "file-saver": "^2.0.5",
      "fs-extra": "^10.0.0",
      "google-map-react": "^2.2.1",
      "helmet": "^7.1.0",
      "html-webpack-plugin": "^5.5.0",
      "identity-obj-proxy": "^3.0.0",
      "jest": "^27.4.3",
      "jest-resolve": "^27.4.2",
      "jest-watch-typeahead": "^1.0.0",
      "jspdf": "^2.5.1",
      "jspdf-autotable": "^3.8.2",
      "mini-css-extract-plugin": "^2.4.5",
      "multer": "^1.4.5-lts.1",
      "mysql": "^2.18.1",
      "mysql2": "^3.9.2",
      "ngrok": "^5.0.0-beta.2",
      "nodemon": "^3.1.0",
      "pm2": "^5.3.1",
      "postcss": "^8.4.4",
      "postcss-flexbugs-fixes": "^5.0.2",
      "postcss-loader": "^6.2.1",
      "postcss-normalize": "^10.0.1",
      "postcss-preset-env": "^7.0.1",
      "prompts": "^2.4.2",
      "react": "^18.2.0",
      "react-app-polyfill": "^3.0.0",
      "react-dev-utils": "^12.0.1",
      "react-dom": "^18.2.0",
      "react-refresh": "^0.11.0",
      "resize-observer-polyfill": "^1.5.1",
      "resolve": "^1.20.0",
      "resolve-url-loader": "^4.0.0",
      "sass-loader": "^12.3.0",
      "semver": "^7.3.5",
      "sheetjs-style": "^0.15.8",
      "socket.io": "^4.7.4",
      "socket.io-client": "^4.7.4",
      "source-map-loader": "^3.0.0",
      "style-loader": "^3.3.1",
      "tailwindcss": "^3.0.2",
      "terser-webpack-plugin": "^5.2.5",
      "thai-wordcut": "^0.7.7",
      "thaidatepicker-react": "^1.2.1",
      "typescript": "^5.4.2",
      "uuid": "^9.0.1",
      "web-vitals": "^2.1.4",
      "webpack": "^5.64.4",
      "webpack-dev-server": "^4.6.0",
      "webpack-manifest-plugin": "^4.0.2",
      "wordcut": "^0.9.1",
      "workbox-webpack-plugin": "^6.4.1"
      ```

   - Install Database
      - SQL/main/Structure Database.sql
      - setup user admin
        ```
        INSERT INTO `admin` 
         (username , password , phone , address) 
         VALUES ('--username--' , SHA2('--password--', 256) , '--number phone--' , POINT(0000 , 0000))
        ```

### Build Project

   - After install packages and .env
      ```
      npm run build
      ```
   
### Start Server

   - Development
      - start ngrok (หากจะทดสอบ line liff)
         ```
         npm run server-ngrok
         ```
      - start server react admin , doctor , farmer
        - admin
          ```
          npm run server-admin
          ```
        - doctor
          ```
          npm run server-doctor
          ```
        - farmer
          ```
          npm run server-farmer
          ```
      - start API
         ```
         npm run server-dev
         ```

   - Development test after build
      - start API
         ```
         npm run server-dev-router
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