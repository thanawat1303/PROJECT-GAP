import React, { useEffect, useState } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";
import Login from "./Login";
import Admin from "./Admin";

import './assets/style/main.scss'


const MainAdmin = () => {
    const [body , setBody] = useState(<></>)

    useEffect(()=>{
        clientMo.post('/api/admin/check').then((context)=>{
            if(context) setBody(<Admin main={this}/>)
            else setBody(<Login setMain={this}/>)
            
            clientMo.addAction('#loading' , 'hide' , 1000)
        })
    },[])

    return (body)
}

export default MainAdmin