import React from "react";

const ButtonMenu = ({type , textRow1 , textRow2 , action}) => {
    return(
        <div onClick={action} className={`bt-menu-frame ${type}`}>
            <img src={`/iconBt/icon-bt-${type}.png`}></img>
            <div className="text-one">{textRow1}</div>
            <div className="text-two">{textRow2}</div>
            <div className="action">
                <button>คลิก</button>
            </div>
        </div>
    )
}

export {ButtonMenu}