import React, { useEffect, useRef, useState } from "react";

const PopupAlert = ({textData , result , open , liff}) => {
    const Control = useRef()

    // useEffect(()=>{
    //     Control.current.style.opacity = "1"
    //     Control.current.style.visibility = "visible"
    // } , [])

    const confirm = () => {
        if(result == 1 || result == 2) {
            liff.closeWindow()
        } else {
            alert("error")
        }
    }
    return (
        <section ref={Control} style={{
            display: "flex" ,
            justifyContent : "center",
            alignItems:"center",
            flexDirection : "column" ,
            zIndex : "15",
            width : "100%",
            height : "100%",
            position : "absolute" ,
            backgroundColor : "transparent" ,
            backdropFilter : "blur(8px)" ,
            opacity : open ? "1" : "0" ,
            visibility : open ? "visible" : "hidden",
            transition : "0.5s opacity , 0.5s visibility"
        }}>
            <div style={{
                display: "flex" ,
                justifyContent : "center",
                alignItems:"center",
                flexDirection : "column" ,
                backgroundColor: "white",
                padding : "10px" ,
                borderRadius : "10px" ,
                boxShadow : "0px 0px 15px green"
            }}>
                {textData}
                <div style={{
                    marginTop : "10px"
                }}>
                    <button onClick={confirm}>ตกลง</button>
                </div>
            </div>
        </section>
    )
}

export {PopupAlert}