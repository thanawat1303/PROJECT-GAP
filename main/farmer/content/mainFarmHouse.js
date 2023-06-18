import React, { useEffect, useState } from "react";


import {clientMo}  from "../../../src/assets/js/moduleClient";
import FarmBody from "./FarmBody";

const MenuMain = ({liff , uid}) => {

    const [Body , setBody] = useState(<></>)

    // ไล่ให้เมนูเริ่มต้น เป็น List การปลูกเลย
    useEffect(()=>{
        CheckFarm()
    } , [])

    const CheckFarm = async () => {
        const auth = window.location.href.split("?")[1]
        const path = new Map([...auth.split("&").map((val)=>val.split("="))])
        const result = await clientMo.post('/api/farmer/farmhouse/select' , {
            id_farmhouse : path.get("f"),
            uid : uid
        })
        if(result === "access") setBody(<FarmBody liff={liff} uid={uid}/>)
        else if (result === "not") setBody(<>ไม่พบโรงเรือนนี้</>)
    }

    return (Body)
}

export default MenuMain