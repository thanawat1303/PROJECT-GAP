import React, { useEffect, useRef, useState } from "react";
import {Loading} from "../../src/assets/js/module"
const PopupAlert = ({textData , setText , result , setResult , open , setOpen , liff}) => {
    const Control = useRef()

    const [state , setstate] = useState(false)

    // useEffect(()=>{
    //     Control.current.style.opacity = "1"
    //     Control.current.style.visibility = "visible"
    // } , [])

    const confirm = () => {
        if(result != 0) {
            if(result == 1 || result == 2) {
                liff.closeWindow()
            } else {
                setText("")
                setResult(0)
                setOpen(0)
            }
        }
    }

    const ShowStatus = () => {
        setstate(true)
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
                backgroundColor: "transparent",
                padding : "15px 30px" ,
                borderRadius : "15px" ,
                // boxShadow : "0px 0px 15px green",
            }}>
                <div style={{
                    marginBottom : "10px",
                    fontFamily : "TH-font",
                    fontSize : "25px",
                    fontWeight : "900",
                    backgroundColor : "white",
                    paddingLeft : "10px",
                    paddingRight : "10px",
                    paddingTop : "6px",
                    borderRadius : "20px"
                }}>
                    {textData ? state ? textData : "กำลังตรวจสอบ" : "กำลังตรวจสอบ"}
                </div>
                <div onLoad={ShowStatus}>
                    {
                        result ? 
                            (result == 1) ? 
                                <img style={{
                                    position : "absolute",
                                    width : "90px",
                                    opacity : state ? 1 : "0",
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility",
                                    backgroundColor : "transparent",
                                    backdropFilter : "blur(8px)",
                                    borderRadius : "50%"
                                }} src="/correct-icon-green.svg"></img> 
                                :
                                <img style={{
                                    position : "absolute",
                                    width : "90px",
                                    opacity : state ? 1 : "0",
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility"
                                }} src="/error-cross-svgrepo-com.svg"></img>
                        : <></>
                    }
                    <div style={{
                        opacity : !state ? 1 : "0",
                        visibility : !state ? "visible" : "hidden",
                        transition : "0.5s opacity , 0.5s visibility"
                    }}>
                        <Loading size={90} border={10} color="white" />
                    </div>
                </div>
                <div style={{
                    marginTop : "10px"
                }}>
                    <button
                        style={{
                            backgroundColor : "green",
                            border : "0",
                            borderRadius : "15px",
                            padding : "0px 25px",
                            paddingTop : "2px",
                            fontFamily : "TH-font",
                            fontSize : "30px",
                            fontWeight : "900",
                            color : "white",
                            opacity : (result == 0) ? 0 : 1,
                            visibility : (result == 0) ? "hidden" : "visible",
                            transition : "0.5s opacity , 0.5s visibility"
                        }}
                        onClick={confirm}>ตกลง</button>
                </div>
            </div>
        </section>
    )
}

export {PopupAlert}