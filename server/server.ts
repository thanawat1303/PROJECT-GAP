import db from 'mysql'
import appRun from './appRun'
require('dotenv').config().parsed

let username = (process.argv[2] == process.env.BUILD) ? process.env.USER_DB : process.env.USER_DBDEV ?? ""
let password = (process.argv[2] == process.env.BUILD) ? process.env.PASSWORD_DB : process.env.PASSWORD_DBDEV ?? ""
let state = 0

console.log("Read Database...")
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

                    appRun(username , password)
                };
            })
        }
    });
} else {
    appRun(username , password)
}