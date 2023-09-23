const dbFunc = require('./dbConfig')
const crypto = require("crypto")

const ErrorDB = (connectDB, err, res) => {
  dbFunc.dbErrorReturn(connectDB, err, res)
}

const apifunc = {
  auth: (connectDB, username, password, res, authAccount) => {
    return new Promise((resole, reject) => {
      connectDB.connect((err) => {
        if (err) {
          // ErrorDB(connectDB, err, res);
          reject("connect");
        }

        let usernameDB = authAccount == "admin" ? "username" : authAccount == "acc_doctor" ? "id_doctor" : "";
        let passwordDB = authAccount == "admin" ? "password" : authAccount == "acc_doctor" ? "password_doctor" : "";

        let ORDER = authAccount == "admin" ? "" : authAccount == "acc_doctor" ? "ORDER BY status_delete ASC" : "";
        connectDB.query(
          `SELECT * FROM ${authAccount} WHERE ${usernameDB} = ? AND ${passwordDB}=SHA2( ? , 256) ${ORDER}`,
          [username, password],
          (err, result) => {
            if (err) {
              // ErrorDB(connectDB, err, res);
              reject("not pass");
            } else {
              if (result[0]) {
                resole({
                  data : result[0],
                  result:"pass"
                });
              } else {
                reject("not pass");
              }
            }
          }
        );
      });
    });
  },

  generateID : (length , type = "text") => {
      let result = '';
      let charText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charNumber = "0123456789"
      let characters = (type === "num") ? charNumber : charText ;
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  },

  DateTime : (DateCurrent) => {
    const year = DateCurrent.getFullYear();
    const month = String(DateCurrent.getMonth() + 1).padStart(2, '0');
    const day = String(DateCurrent.getDate()).padStart(2, '0');
    const hours = String(DateCurrent.getHours()).padStart(2, '0');
    const minutes = String(DateCurrent.getMinutes()).padStart(2, '0');
    const seconds = String(DateCurrent.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  getTokenCsurf : (request) => {
    const headers = request.headers
    const patternCsurf = `${headers["user-agent"]} ${headers["sec-ch-ua"]} ${headers["x-forwarded-for"]} ${headers["sec-ch-ua-platform"]}`
    const modiText = `${patternCsurf}`.replaceAll("undefined" , "").replaceAll(" " , "").trim()
    const hashedText = crypto.createHmac('sha256' , process.env.KEY_SESSION).update(modiText).digest('hex')
    return hashedText
  },

  authCsurf : (authType , request , response) => {
    const username = (authType === "admin") ? request.session.user_admin : (authType === "doctor") ? request.session.user_doctor : "";
    const password = (authType === "admin") ? request.session.pass_admin : (authType === "doctor") ? request.session.pass_doctor : "";
    const token = request.session.tokenSession

    if((username || password) && token !== apifunc.getTokenCsurf(request)) return false
    else return true
  },
};

module.exports = apifunc;
