import React, { useEffect } from "react";
import { clientMo } from "../../src/assets/js/moduleClient";

const House = () => {
    useEffect(()=>{
        clientMo.addAction('#loading' , 'hide' , 1000)
    } , [])
    return (
        <section>
            เพิ่มโรงเรือน
        </section>
    )
}

export default House