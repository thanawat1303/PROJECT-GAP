import React, { useEffect } from "react";

const ManageData = (Ref , setPopup , Data) => {
    useEffect(()=>{
        Ref.current.opacity = 1
        Ref.current.visibility = "visible"
    } , [])

}