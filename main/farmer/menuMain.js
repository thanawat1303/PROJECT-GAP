import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";

const MenuMain = ({path , liff , uid}) => {

    const [Body , setBody] = useState(0)

    useEffect(()=>{
        clientMo.post('/api/farmer/farmhouse/select' , {
            id_farmhouse : path.get("farm"),
            uid : uid
        }).then((result)=>{
            clientMo.addAction('#loading' , 'hide' , 1000)
            if(result === "access") setBody("PASS")
        })
        
    } , [])

    return (
        Body
    )
}

export default MenuMain