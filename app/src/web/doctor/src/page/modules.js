import React, { useContext } from "react";
import { DoctorProvider } from "../main";
import Locals from "../../../../locals";

const ButtonMenu = ({type , textRow1 , textRow2 , action}) => {
    const { lg } = useContext(DoctorProvider)
    return(
        <div onClick={action} className={`bt-menu-frame ${type}`}>
            <img src={`/iconBt/icon-bt-${type}.png`}></img>
            <div className="text-one">{textRow1}</div>
            <div className="text-two">{textRow2}</div>
            <div className="action">
                <button>{Locals[lg]["click"]}</button>
            </div>
        </div>
    )
}

export {ButtonMenu}