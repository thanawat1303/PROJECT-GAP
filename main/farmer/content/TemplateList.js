import React, { useRef } from "react";
import "../assets/Template.scss"
// import MenuPlant from "./PlantList/MenuPlant";
// import { CloseAccount } from "../method";
// import { clientMo } from "../../../src/assets/js/moduleClient";

const Template = ({PopUp = {PopupRef : useRef() , PopupBody : <></>} ,
List , Loading , action , Option = {TextHead : "" , img : ""} , actionReturn}) => {
    return(
        <section className="plant">
            <section ref={PopUp.PopupRef} className="popup-add">
                {PopUp.PopupBody}
            </section>
            <div className="content-body">
                <div className="head">
                    <div className="title">
                        {actionReturn ? 
                            <div className="return" onClick={actionReturn}>
                                <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                                    <g fillRule="evenodd">
                                        <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
                                        <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
                                    </g>
                                </svg>
                            </div> : <></>
                        }
                        <span>{Option.TextHead}</span>
                    </div>
                    <div onClick={action} className="frame-menu">
                        <div className="img">
                            <img src={Option.img}></img>
                        </div>
                        { action ? <span>เพิ่มการบันทึก</span> : <></> }
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