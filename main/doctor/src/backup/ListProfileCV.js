import React, { useEffect, useState } from "react";

const ListProfileShow = (props) => {
    const [profile , setProfile] = useState("")
    const [HeadList , setHead] = useState("")
    const [List , setList] = useState("")
    const [imgProfile , setImg] = useState("")
    
    useEffect(()=>{
        setList(
                props.farmer.map((list , index)=>
                    <div className="option-list" key={index} onClick={SelectProfile}>
                        {list['id_farmer']} {list['fullname']}
                    </div>
                )
            )
    } , [])

    const SelectProfile = (e) => {
        console.log(e)
    }

    return(
        <section id="profile-List-select">
            <div className="head-list">เลือกบัญชีที่ต้องการเชื่อมโยง</div>
            <div id="select-profile">
                <input placeholder="ค้นหาไอดีหรือชื่อ"></input>
                <div className="list-account">
                    {List}
                </div>
            </div>
        </section>
    )
}

export {ListProfileShow}