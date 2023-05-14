const packetDB = require('./dbConfig')

const apifunc = {
  auth: (connectDB, username, password, res , authAccount) => {
    return new Promise((resole, reject) => {
      connectDB.connect(err => {
        if (err) {
          packetDB.dbErrorReturn(connectDB, err, res);
          reject("connect");
        }

        let usernameDB = authAccount == "admin" ? "username" : authAccount == "acc_doctor" ? "id_doctor" : "";
        let passwordDB = authAccount == "admin" ? "password" : authAccount == "acc_doctor" ? "password_doctor" : "";

        connectDB.query(
          `SELECT * FROM ${authAccount} WHERE ${usernameDB}=? AND ${passwordDB}=SHA2( ? , 256)`,
          [username, password],
          (err, result) => {
            if (err) {
              packetDB.dbErrorReturn(connectDB, err, res);
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
  }
};

module.exports = apifunc;
