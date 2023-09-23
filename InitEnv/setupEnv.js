const fs = require('fs')
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileJson = fs.readFileSync(__dirname + "/jsonEnv.json")
const readJson = JSON.parse(fileJson)

const JsonToArr = Object.entries(readJson)
let indexCurrent = 0

const inputValue = async () => {
    return await new Promise((resole , reject)=>{
        rl.question(`${JsonToArr[indexCurrent][0]} : `, (data) => {
            readJson[JsonToArr[indexCurrent][0]] = data.trim()
    
            if(indexCurrent == JsonToArr.length - 1) {
                rl.close()
                resole(false)
            }
            else {
                rl.write("")
                indexCurrent++;
                resole(true)
            }
        })
        rl.write(JsonToArr[indexCurrent][1])
    })
}

const recovRead = async () => {
    const result = await inputValue()

    if(result) recovRead()
    else {
        console.log(readJson)
    }
}

recovRead()