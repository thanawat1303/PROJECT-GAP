import React, { useEffect } from "react"
import { clientMo } from "../../../assets/js/moduleClient"
const CloseAccount = (result , setPage , textError = "") => {
    return new Promise((resolve , reject)=>{
        if(document.getElementById("loading").classList[0] !== "hide")
            clientMo.unLoadingPage()
        if(result === "close" || result === "error auth" || result === "not found") {
            if(result === "close") {
                document.querySelector("#session-farmer .body #session-text").innerHTML = "บัญชีถูกปิด กรุณาสมัครใหม่"
            } else if (result === "not found") {
                document.querySelector("#session-farmer .body #session-text").innerHTML = "ไม่พบฟอร์ม"
            } else {
                document.querySelector("#session-farmer .body #session-text").innerHTML = "กรุณาเข้าใหม่อีกครั้ง"
            }
            document.querySelector("#session-farmer").style.opacity = "1"
            document.querySelector("#session-farmer").style.visibility = "visible"
            try {
                setPage("error page")
            } catch(e) {}
            resolve(0)
        } else if (result === "not line") {
            document.querySelector("#session-farmer .body #session-text").innerHTML = textError
            document.querySelector("#session-farmer").style.opacity = "1"
            document.querySelector("#session-farmer").style.visibility = "visible"
        }
        else {
            resolve(1)
        }
    })
}

const GetPath = () => {
    return window.location.pathname.split("/").slice(3,window.location.pathname.split("/").length).filter(val=>val)
}

export {CloseAccount , GetPath}