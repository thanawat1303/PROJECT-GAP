import React, { useEffect } from "react"

const NonLine = () => {
    useEffect(()=>{
        clientMo.addAction('#loading' , 'hide' , 1000)
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