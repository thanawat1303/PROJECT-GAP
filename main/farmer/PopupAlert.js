import React, { useEffect, useRef } from "react";

const PopupAlert = (props) => {
    const Control = useRef()

    useEffect(()=>{
        Control.current.style.opacity = "1"
        Control.current.style.visibility = "visible"
    } , [])
    return (
        <section ref={Control} style={{
            display: "flex" ,
            justifyContent : "center",
            alignItems:"center",
            zIndex : "15",
            width : "100%",
            height : "100%",
            position : "absolute" ,
            backgroundColor : "transparent" ,
            backdropFilter : "blur(8px)" ,
            opacity : "0" ,
            visibility : "hidden",
            transition : "0.5s opacity , 0.5s visibility"
        }}>
            {props.result.text}
            {props.result.result}
        </section>
    )
}

export {PopupAlert}