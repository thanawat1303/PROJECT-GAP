const bcrypt = require('bcrypt')

const apifunc = {
  auth: (connectDB, username, password, res, packetDB) => {
    return new Promise((resole, reject) => {
      connectDB.connect(err => {
        if (err) {
          packetDB.dbErrorReturn(connectDB, err, res);
          reject("connect");
        }

        bcrypt.hash(req.body['passwordDT'] , parseInt(process.env.HashRound)).then((password)=>{
          connectDB.query(
            `SELECT * FROM accountdt WHERE id_docter=? AND Password_docter=?`,
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
        })
      });
    });
  }
};

module.exports = apifunc;
