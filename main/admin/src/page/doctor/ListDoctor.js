import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";

import "../../assets/style/page/doctor/ListDoctor.scss"
import { ReportAction } from "../../../../../src/assets/js/module";
import ManagePage from "./ManagePage";
const ListDoctor = ({status , PageAddRef , auth , TabOn}) => {
    const [Body , setBody] = useState(<></>)
    const [List , setList] = useState(<></>)
    const [Because , setBecause] = useState(<></>)

    const ListRef = useRef()
    const RefBe = useRef()
    const ShowBecause = useRef()

    useEffect(()=>{
        if(status.changePath) window.history.pushState({} , "" , `/admin/list?${status.status}`)

        TabOn.addTimeOut(TabOn.end())

        setList(<></>)
        LoadPageData()

        window.removeEventListener("resize" , sizeScreen)
        window.addEventListener("resize" , sizeScreen)

        return() => {
            window.removeEventListener("resize" , sizeScreen)
        }
    } , [status])

    const OpenConfirmPage = async (id_table_doctor , typeStatus) => {
        const method = () => {
            const status = parseInt(document.querySelector(`#doctor-list-${id_table_doctor} Action-bt Bt-status .frame`).getAttribute("status"))
            setBecause(<ManagePage RefOnPage={RefBe} id_table={id_table_doctor} type={typeStatus} status={status} setBecause={setBecause}/>)
        }
        auth(method)
    }

    const OpenDetailManage = async (id_table_doctor , typeStatus) => {
        const method = () => {

        }
        auth(method)
    }

    const sizeScreen = () => {
        console.log(111)
        const count = ListRef.current.getAttribute("count")
        if(window.innerWidth < 1100 && count != 2) {
            fetchDataList(2)
        } else if (window.innerWidth >= 1100 && count != 3) {
            fetchDataList(3)
        }
    }
    const LoadPageData = () => {
        if(window.innerWidth < 1100) {
            fetchDataList(2)
        } else if (window.innerWidth >= 1100) {
            fetchDataList(3)
        }
    }

    const fetchDataList = async (maxColumn) => {
        const ObjectData = await clientMo.post("/api/admin/doctor/list" , {typeDelete : (status.status === "default" ? 0 : status.status === "delete" ? 1 : -1)})
        const List = JSON.parse(ObjectData)
        const ListExport = new Array()
        const max = maxColumn

        ListRef.current.setAttribute("count" , max)

        for(let x=0; x<=List.length ;x += max) {
            const account = JSON.parse(ObjectData)
            ListExport.push(account.splice(x , x+max))
        }

        const doctorList = 
            ListExport.map((row , key)=>{
                while(row.length < max) row.push({data : "null"})
                return (
                <Row-List className={`row-${key}`} key={key}>
                    {
                        row.map((data , key)=>{
                            if(!data.data) 
                                return(
                                <List-Doctor-dody key={key} id={`doctor-list-${data.id_table_doctor}`}>
                                    <Detail-doctor>
                                        <Detail-Image>
                                            <img src="/doctor-svgrepo-com.svg"></img>
                                        </Detail-Image>
                                        <Detail-data>
                                            <Detail-in-fullname>
                                                <input value={data.fullname_doctor ? data.fullname_doctor : "เจ้าหน้าที่ส่งเสริมยังไม่ทำการระบุชื่อ"} readOnly></input>
                                            </Detail-in-fullname>
                                            <Detail-in>
                                                <span className="head-data">รหัสประจำตัว</span>
                                                <span>:</span>
                                                <input className="input-id" value={data.id_doctor} readOnly></input>
                                            </Detail-in>
                                            <Detail-in>
                                                <span className="head-data station">ศูนย์</span> 
                                                <span>:</span>
                                                <input value={data.station ? data.station : "เจ้าหน้าที่ส่งเสริมยังไม่ระบุ"} readOnly></input>
                                            </Detail-in>
                                        </Detail-data>
                                    </Detail-doctor>
                                    <Action-bt>
                                        <content-status because={1}>
                                            <bt-because>
                                                <button onClick={()=>OpenDetailManage(data.id_table_doctor , "status_account")}>เหตุผล</button>
                                            </bt-because>
                                            <Bt-status onClick={()=>OpenConfirmPage(data.id_table_doctor , "status_account")}>
                                                <div className="frame" status={data.status_account ? "1" : "0"}>
                                                    <span>ON</span>
                                                    <span className="dot"></span>
                                                    <span>OFF</span>
                                                </div>
                                            </Bt-status>
                                        </content-status>
                                        <bt-delete>
                                            <button onClick={()=>OpenConfirmPage(data.id_table_doctor , "status_delete")}>ลบบัญชี</button>  
                                        </bt-delete>
                                    </Action-bt>
                                </List-Doctor-dody>
                                )
                            else 
                                return(
                                <List-Doctor-null key={key}>
                                </List-Doctor-null>
                                )
                        })
                    }
                </Row-List>
                )
            })
                        
        setList(doctorList)
    }

    return(
        <section className="body-list-doctor">
            {
                status.status === "default" ? <InsertPage PageAddRef={PageAddRef}/> : <></>
            }
            <div className="List-doctor" ref={ListRef}>
                {List}
            </div>
            <div ref={RefBe} className="page-because-popup">
                {Because}
            </div>
            <div ref={ShowBecause} className="page-because-popup"></div>
        </section>
    )

}

const InsertPage = ({PageAddRef}) => {

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const [sizeReport , setSize] = useState(0)

    const uDoctor = useRef()
    const pwDoctor = useRef()
    const pwAdmin = useRef()

    useEffect(()=>{
        setSize(PageAddRef.current.clientHeight * 0.3)
    })

    const ClickAdd = async (e) => {
        let Udoctor = uDoctor.current
        let PWdoctor = pwDoctor.current
        let PWadmin = pwAdmin.current
        if(Udoctor.value && PWdoctor.value && PWadmin.value) {
            let data = {
                id_doctor : Udoctor.value,
                passwordDT : PWdoctor.value,
                passwordAd : PWadmin.value
            }

            setOpen(1)
            setText("")
            setStatus(0)
            let result = await clientMo.post("/api/admin/add" , data)
            if(result === "correct") {
                setText("เพิ่มบัญชีผู้ส่งเสริมสำเร็จ")
                setStatus(1)
                Udoctor.value = ""
                PWdoctor.value = ""
                PWadmin.value = ""
            }
            else if(result === "incorrect") {
                setText("รหัสผู้ดูแลไม่ถูกต้อง")
                setStatus(2)
                PWadmin.value = ""
            } else if (result === "overflow") {
                setText("มีบัญชีผู้ส่งเสริมนี้แล้ว")
                setStatus(2)
                Udoctor.value = ""
                PWdoctor.value = ""
                PWadmin.value = ""
            }
            else {
                setOpen(0)
            }
        } else {
            console.log("not")
        }
        e.preventDefault()
    }

    const Cancel = () => {
        let Udoctor = uDoctor.current
        let PWdoctor = pwDoctor.current
        let PWadmin = pwAdmin.current
        Udoctor.value = ""
        PWdoctor.value = ""
        PWadmin.value = ""

        PageAddRef.current.toggleAttribute("show")
    }

    return(
        <section ref={PageAddRef} className="page-insert">
            <div className="Load-insert">
                <ReportAction Open={Open} Text={Text} Status={Status}
                    setOpen={setOpen} setStatus={setStatus} setText={setText}
                    sizeLoad={sizeReport} BorderLoad={8} color={"white"}/>
            </div>
            <div className="body-page">
                <span className="head">เพิ่มบัญชีเจ้าหน้าที่ส่งเสริม</span>
                <div className="detail-doctor">
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>
                        <input ref={uDoctor} placeholder="รหัสประจำตัวผู้ส่งเสริม"></input>
                    </label>
                    <label>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2h1m-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3Z"/></svg>
                        <input ref={pwDoctor} placeholder="รหัสผ่านบัญชีผู้ส่งเสริม" type="password"></input>
                    </label>
                </div>
                <label className="admin-confirm">
                    <input ref={pwAdmin} placeholder="รหัสผ่านผู้ดูแลระบบ" type="password"></input>
                </label>
                <div className="bt-submit">
                    <button className="cancel" onClick={Cancel}>ยกเลิก</button>
                    <button className="submit" onClick={ClickAdd}>เพิ่มข้อมูล</button>
                </div>
            </div>
        </section>
    )
}

export default ListDoctor