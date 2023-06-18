import React, { useRef } from "react";
import "../assets/Template.scss"

const Template = ({PopUp = {PopupRef : useRef() , PopupBody : <></>} ,
List , Loading , action , Option = {TextHead : "" , img : ""}}) => {
    return(
        <section className="plant">
            <section ref={PopUp.PopupRef} className="popup-add">
                {PopUp.PopupBody}
            </section>
            <div className="content-body">
                <div className="head">
                    <div className="title">{Option.TextHead}</div>
                    <div onClick={action} className="frame-menu">
                        <div className="img">
                            <img src={Option.img}></img>
                        </div>
                        <span>เพิ่มการบันทึก</span>
                    </div> 
                </div>
                <div className="list-plant">
                    {List}
                    {Loading}
                </div>
            </div>
        </section>
    )
}

export default Template