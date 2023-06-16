import React, { useEffect } from "react"
import { clientMo } from "../../src/assets/js/moduleClient"

const NonLine = () => {
    useEffect(()=>{
        clientMo.unLoadingPage()
    })
    return(
        <section id="not-online">
            โปรดเข้าช่องทางแอปพลิเคชันไลน์นะครับ
            <a href="https://line.me/R/ti/p/@378zrgwy">
                <button>เข้าสู่ไลน์</button>
            </a>
        </section>
    )
}

export {NonLine}