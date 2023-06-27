import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/form/formList.scss"
import { DayJSX } from "../../../../../src/assets/js/module";

const FormList = ({setMain , session , socket , type = 0 , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    const [statusPage , setStatus] = useState({
        status : LoadType.split(":")[0],
        open : type
    })
    
    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        setTextStatus(["หน้าหลัก" , "แบบบันทึกการปลูก" , "รายการแบบบันทึก"])
        clientMo.unLoadingPage()

        if(LoadType.split(":")[1] === "pop")
            chkPath()

    } , [LoadType])

    const chkPath = () => {
        if(LoadType.split(":")[0] === "ap") 
            setStatus({
                status : "ap",
                open : 0
            })
        else if(LoadType.split(":")[0] === "wt") 
            setStatus({
                status : "wt",
                open : 0
            })
    }

    const changeMenu = (typeClick) => {
        if(typeClick !== statusPage.status) {
            setStatus({
                status : typeClick,
                open : 1
            })
        }
    }

    return(
        <section className="form-list-page">
            <div className="bt-action">
                <button className="approv" onClick={()=>changeMenu("ap" , 1)}>บัญชีตรวจสอบแล้ว</button>
                <button className="wait" onClick={()=>changeMenu("wt" , 1)}>บัญชียังไม่ตรวจสอบ</button>
            </div>
            <div className="form-list">
                <List session={session} socket={socket} status={statusPage}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , status}) => {
    const [Body , setBody] = useState(<></>)
    
    useEffect(()=>{
        setBody(<></>)
        FetchList()
    } , [status])

    const FetchList = async () => {
        const list = await clientMo.post('/api/doctor/list/form' , {type : 0 , approve:(status.status == "wt") ? 0 : 1})
        try {
            if(status.open === 1) window.history.pushState({} , "" , `/doctor/form/${status.status}`)
            let data = JSON.parse(list)
            if(data.length !== 0) {
                let DataArray = []
                let MaxData = 3
                for (let i = 0; i <= data.length; i+=MaxData){
                    DataArray.push(data.slice(i , i+MaxData))
                }
                setBody(DataArray.map((Data , key)=>(
                    <section key={key} className="row">
                        {Data.map((val , key)=>(
                            <div key={key} className="content-list-form">
                                <div className="inrow">
                                    <div className="type-main">
                                        {val.type_main}
                                    </div>
                                    <div className="type">
                                        {val.type}
                                    </div>
                                    <div className="date">
                                        <span>ปลูก</span>
                                        <DayJSX DATE={val.date_plant} TYPE="SMALL"/>
                                    </div>
                                </div>
                                <div className="inrow">
                                    <div className="system-glow">
                                        ระบบการปลูก {val.system_glow}
                                    </div>
                                    <div className="factor">
                                        <span>
                                            ปุ๋ย {val.ctFer} ครั้ง
                                        </span>
                                        <span className="dot">|</span>
                                        <span>
                                            สารเคมี {val.Ctche} ครั้ง
                                        </span>
                                    </div>
                                </div>
                                <div className="inrow">
                                    <div className="insect">
                                        ศัตรูพืช {val.insect}
                                    </div>
                                    <div className="factor">
                                        <span className="generation">
                                            รุ่น {val.generation}
                                        </span>
                                        <span className="qty">
                                            จำนวน {val.qty} ต้น
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )))
            } else {
                setBody(
                    <section>
                        <div>ไม่พบข้อมูล</div>
                    </section>
                )
            }
                
        } catch(e) {
            session()
        }
    }

    return (Body)
}

export default FormList