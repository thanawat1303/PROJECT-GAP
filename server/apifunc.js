const dbFunc = require('./dbConfig')

const ErrorDB = (connectDB, err, res) => {
  dbFunc.dbErrorReturn(connectDB, err, res)
}

const apifunc = {
  auth: (connectDB, username, password, res, authAccount) => {
    return new Promise((resole, reject) => {
      connectDB.connect((err) => {
        if (err) {
          ErrorDB(connectDB, err, res);
          reject("connect");
        }

        let usernameDB = authAccount == "admin" ? "username" : authAccount == "acc_doctor" ? "id_doctor" : "";
        let passwordDB = authAccount == "admin" ? "password" : authAccount == "acc_doctor" ? "password_doctor" : "";

        let ORDER = authAccount == "admin" ? "" : authAccount == "acc_doctor" ? "ORDER BY status_delete ASC" : "";
        connectDB.query(
          `SELECT * FROM ${authAccount} WHERE ${usernameDB}=? AND ${passwordDB}=SHA2( ? , 256) ${ORDER}`,
          [username, password],
          (err, result) => {
            if (err) {
              ErrorDB(connectDB, err, res);
              reject("query");
            }

            if (result[0]) {
              resole({
                data : result[0],
                result:"pass"
              });
            } else {
              reject("not pass");
            }
          }
        );
      });
    });
  },

  generateID : (length) => {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }
};

module.exports = apifunc;
