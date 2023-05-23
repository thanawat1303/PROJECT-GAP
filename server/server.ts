import db from 'mysql'
import {appConfig} from './configExpress'
require('dotenv').config().parsed

let username = process.env.USER_DBDEV ?? ""
let password = process.env.PASSWORD_DBDEV ?? ""
let state = 0

if(!username && !password) {
    process.stdout.write('USERNAME DB : ')
    process.stdin.on('data', (data) => {
        const input = data.toString().trim();
    
        if(state == 0) {
            username = input
            process.stdout.write('PASSWORD DB: ')
            state = 1
        }
        else if(state == 1) password = input

        if(username && password && state == 1) {
            let con = db.createConnection({
                host: process.env.HOST,
                user: username,
                password : password,
                database : process.argv[2] == process.env.BUILD ? process.env.DATABASE_SER : process.env.DATABASE_DEV 
            })
            
            con.connect((err: { errno: number })=>{
                if (err) {
                    state = 0
                    username = password = ""
                    if(err.errno == 1045) {console.log('Denien connect Database')}
                    
                    console.log('Please enter username and password again\n')
                    process.stdout.write('USERNAME DB : ')
                } else {
                    console.log("Check DB connected success!");
                    state = 2
                    con.end()

                    const app = appConfig(username , password)
                    app.listen(process.env.PORT , "0.0.0.0" , function () {
                        console.log('Start on port '+process.env.PORT+'!\n');
                    });
                };
            })
        }
    });
} else {
    const app = appConfig(username , password)
    app.listen(process.env.PORT , "0.0.0.0" , function () {
        console.log('Start on port '+process.env.PORT+'!\n');
    });
}