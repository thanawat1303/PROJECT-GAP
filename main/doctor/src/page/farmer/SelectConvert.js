import React, { useEffect, useState } from "react";
import "../../assets/style/page/farmer/SelectConvert.scss"
import { clientMo } from "../../../../../src/assets/js/moduleClient";

const SelectConvert = ({RefPop , setPopup , setProfile , id_table , session }) => {
    const [Data , setData] = useState([])
    const [Count , setCount] = useState(5)
    
    useEffect(()=>{
        RefPop.current.style.opacity = "1"
        RefPop.current.style.visibility = "visible"
        FetchList(1 , "")
    } , [])

    const FetchList = async (count , search) => {
        const result = await clientMo.post("/api/doctor/farmer/list/convert" , {id_table : id_table , search : search , limit : count})
        if(result) {
            const List = JSON.parse(result)
            setData(List)
            return true
        } else session()
    }

    const close = () => {
        RefPop.current.style.opacity = "0"
        RefPop.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    return (
        <section id="select-convert-farmer">
            {Data.length !== 0 ? 
                <div className="search">
                    <input type="search" placeholder="กรอกชื่อหรือรหัสเกษตรกร"></input>
                </div> : <></>

            }
            <div className="close" onClick={close}>
                <svg width="45" height="44" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M35.8125 8.98335C28.5 1.83335 16.5 1.83335 9.1875 8.98335C1.875 16.1334 1.875 27.8667 9.1875 35.0167C16.5 42.1667 28.3125 42.1667 35.625 35.0167C42.9375 27.8667 43.125 16.1334 35.8125 8.98335ZM27.75 29.7L22.5 24.5667L17.25 29.7L14.625 27.1333L19.875 22L14.625 16.8667L17.25 14.3L22.5 19.4333L27.75 14.3L30.375 16.8667L25.125 22L30.375 27.1333L27.75 29.7Z" fill="#FF0000"/>
                </svg>
            </div>
            <div className="body">
                { Data.length !== 0 ?
                    <ListConvert Data={Data} setCount={setCount} Count={Count} Fetch={FetchList}/>
                    :  
                    <div>ไม่พบข้อมูล</div>
                }
            </div>
        </section>
    )
}

const ListConvert = ({Data , setCount , Count , Fetch}) => {
    useEffect(()=>{
        console.log(Data)
    } , [])
    
    return(
        <>
            { Data.map((val , key)=>
                    <section key={key} >
                        <div className="img">
                            <img src={String.fromCharCode(...val.img.data)}></img>
                        </div>
                        <div className="detail">
                            <span>{val.id_farmer}</span>
                            <span>{val.fullname}</span>
                        </div>
                    </section>
                )

            }
        </>
    )
}

export default SelectConvert