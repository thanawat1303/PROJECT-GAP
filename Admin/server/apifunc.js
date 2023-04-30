const apifunc = {
  auth: (connectDB, username, password, res, packetDB) => {
    return new Promise((resole, reject) => {
      connectDB.connect(err => {
        if (err) {
          packetDB.dbErrorReturn(connectDB, err, res);
          reject("connect");
        }

        connectDB.query(
          `SELECT * FROM admin WHERE username=? AND password=?`,
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
