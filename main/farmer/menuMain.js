import React, { useEffect } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";

const MenuMain = ({path , liff}) => {

    useEffect(()=>{
        clientMo.post('/api/farmer/selectfarmhouse' , {})
    })

    return (
        <>menu</>
    )
}

export default MenuMain