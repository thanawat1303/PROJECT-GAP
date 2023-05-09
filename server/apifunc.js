const packetDB = require('./dbConfig')

const apifunc = {
  auth: (connectDB, username, password, res , authAccount) => {
    return new Promise((resole, reject) => {
      connectDB.connect(err => {
        if (err) {
          packetDB.dbErrorReturn(connectDB, err, res);
          reject("connect");
        }

        let usernameDB = authAccount == "admin" ? "username" : authAccount == "acc_docter" ? "id_docter" : "";
        let passwordDB = authAccount == "admin" ? "password" : authAccount == "acc_docter" ? "Password_docter" : "";

        connectDB.query(
          `SELECT * FROM ${authAccount} WHERE ${usernameDB}=? AND ${passwordDB}=SHA2( ? , 256)`,
          [username, password],
          (err, result) => {
            if (err) {
              packetDB.dbErrorReturn(connectDB, err, res);
              reject("query");
            }

            if (result[0]) {
              resole("pass");
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
