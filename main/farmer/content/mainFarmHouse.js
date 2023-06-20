import React, { useEffect, useState } from "react";


import {clientMo}  from "../../../src/assets/js/moduleClient";
import FarmBody from "./FarmBody";
import { GetPath } from "../method";

const MenuMain = ({liff , uid}) => {

    const [Body , setBody] = useState(<></>)

    // ไล่ให้เมนูเริ่มต้น เป็น List การปลูกเลย
    useEffect(()=>{
        CheckFarm()
    } , [])

    const CheckFarm = async () => {
        const result = await clientMo.post('/api/farmer/farmhouse/select' , {
            id_farmhouse : GetPath()[0],
            uid : uid
        })
        if(result === "access") setBody(<FarmBody liff={liff} uid={uid} id_farmhouse={GetPath()[0]}/>)
        else if (result === "not") setBody(<>ไม่พบโรงเรือนนี้</>)
    }

    return (Body)
}

export default MenuMain