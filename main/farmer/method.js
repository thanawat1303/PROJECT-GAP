import React from "react"
const CloseAccount = (result) => {
    return new Promise((resolve , reject)=>{
        if(result === "close" || result === "error auth") {
            if(result === "close") {
                document.querySelector("#session-farmer .body #session-text").innerHTML = "บัญชีถูกปิด กรุณาสมัครใหม่"
            } else {
                document.querySelector("#session-farmer .body #session-text").innerHTML = "กรุณาเข้าใหม่อีกครั้ง"
            }
            document.querySelector("#session-farmer").style.opacity = "1"
            document.querySelector("#session-farmer").style.visibility = "visible"
            resolve(0)
        } else resolve(1)
    })
}

export {CloseAccount}