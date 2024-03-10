import React, { useEffect, useState } from "react";


import {clientMo}  from "../../../../assets/js/moduleClient";
import FarmBody from "./FarmBody";
import { CloseAccount, GetPath } from "../method";

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
        else if (result === "not") CloseAccount("not line" , null , "ไม่พบโรงเรือนของท่าน")
    }

    return (Body)
}

export default MenuMain