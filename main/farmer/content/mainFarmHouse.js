import React, { useEffect, useState } from "react";


import {clientMo}  from "../../../src/assets/js/moduleClient";
import FarmBody from "./FarmBody";

const MenuMain = ({path , liff , uid}) => {

    const [Body , setBody] = useState(<></>)

    useEffect(()=>{
        clientMo.post('/api/farmer/farmhouse/select' , {
            id_farmhouse : path.get("farm"),
            uid : uid
        }).then((result)=>{
            if(result === "access") setBody(<FarmBody path={path} liff={liff} uid={uid}/>)
            else if (result === "not") setBody(<>ไม่พบโรงเรือนนี้</>)
        })
    } , [])

    return (
        Body
    )
}

export default MenuMain