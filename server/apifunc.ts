import dbFunc from './dbConfig';
const ErrorDB = (connectDB : any, err : any, res : any) => {
  dbFunc.dbErrorReturn(connectDB, err, res)
}

const apifunc = {
  auth: (connectDB : any, username : any, password : any, res : any, authAccount : any) => {
    return new Promise((resole, reject) => {
      connectDB.connect((err:any) => {
        if (err) {
          ErrorDB(connectDB, err, res);
          reject("connect");
        }

        let usernameDB = authAccount == "admin" ? "username" : authAccount == "acc_doctor" ? "id_doctor" : "";
        let passwordDB = authAccount == "admin" ? "password" : authAccount == "acc_doctor" ? "password_doctor" : "";

        connectDB.query(
          `SELECT * FROM ${authAccount} WHERE ${usernameDB}=? AND ${passwordDB}=SHA2( ? , 256)`,
          [username, password],
          (err : any, result : any) => {
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
  }
};

export default apifunc;
