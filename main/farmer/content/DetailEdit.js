import React, { useEffect, useState } from "react";
import "../assets/DetailEdit.scss"
import { clientMo } from "../../../src/assets/js/moduleClient";
import { CloseAccount } from "../method";
import { DayJSX, Loading } from "../../../src/assets/js/module";

const DetailEdit = ({Ref , setRef , setPage , type , Data_on}) => {
    const [Data , setData] = useState(null)
    const [HeadEdit , setHead] = useState([])
    const [BodyEdit , setBody] = useState(<></>)
    const [LoadingData , setLoad] = useState(false)
    const UrlFecth = type === "plant" ? "/api/farmer/formplant/edit/select" : "/api/farmer/factor/edit/select" ;
    const DataFetch = type === "plant" ? {
                                            id_farmhouse : Data_on.id_house , 
                                            id_plant : Data_on.id_plant
                                        } 
                                        : {
                                            id_farmhouse : Data_on.id_house , 
                                            id_plant : Data_on.id_plant , 
                                            id_form_factor : Data_on.id_factor , 
                                            type_form : Data_on.type_form
                                        }
    
    useEffect(()=>{
        Ref.current.setAttribute("s" , "")
        Fetch()
    } , [])

    const Fetch = async () => {
        const result = await clientMo.post(UrlFecth , DataFetch)
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setData(Data)
            if(Data[0]) SelectHead(Data[0].id_edit)
        }
    }

    const SelectHead = async (id_table_edit) => {
        setLoad(false)
        const result = await clientMo.post(UrlFecth , {...DataFetch , id_edit : id_table_edit})
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            console.log(Data)
            // if(Data[0]) {
            //     setHead(Data[0])
            //     console.log(Data[0])
            //     setLoad(true)
            // } else setLoad(true)
        }
    }

    return(
        Data === null ?
            <Loading size={"30vw"} border={"2.5vw"} color="#23dd36" animetion={true}/> :
            <section id="detail-edit-popup">
                {
                    Data[0] ?
                    <>
                        <div className="menu-edit">
                            {
                                Data.map((val , key)=>
                                    <span onClick={()=>SelectHead(val.id_edit)} key={key}>{key + 1}</span>
                                )
                            }
                        </div>
                        {
                            LoadingData ?
                            <div className="body-edit">
                                <div className="head-detail-edit">
                                    <div className="row-detail">
                                        <DayJSX DATE={HeadEdit.date} TYPE="small" TEXT="วันที่แก้ไข"/>
                                    </div>
                                    <div className="row-detail">
                                        <span>เหตุผล</span>
                                        <textarea readOnly defaultValue={HeadEdit.because}></textarea>
                                    </div>
                                    <div className="row-detail">
                                        <span>สถานะตรวจสอบ : </span>
                                        <span>
                                            {
                                                HeadEdit.status ? 
                                                    HeadEdit.status == 1 ? "ผ่าน" : "ไม่ผ่าน"
                                                : "ยังไม่ตรวจสอบ"
                                            }
                                        </span>
                                    </div>
                                    {
                                        HeadEdit.status == 2 ? 
                                            <div className="row-detail">
                                            
                                            </div>
                                            : <></>
                                    }
                                </div>
                                <div className="detail">
                                    
                                </div>
                            </div> : <Loading size={"15vw"} border={"2vw"} color="#23dd36" animetion={true}/>
                        }
                    </> :
                    <div>
                        ยังไม่มีการแก้ไขข้อมูล
                    </div>
                }
            </section>
    )
}

export default DetailEdit