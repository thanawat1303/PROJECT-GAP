import React from "react";
import { ReportAction } from "../../../../../src/assets/js/module";

const ListData = ({status , PageAddRef , auth , TabOn}) => {
    const [Body , setBody] = useState(<></>)
    const [List , setList] = useState(<></>)
    const [Because , setBecause] = useState(<></>)
    // const [ShBecause , setShBecause] = useState(<></>)

    const ListRef = useRef()
    const RefPopup = useRef()
    // const ShowBecause = useRef()

    useEffect(()=>{
        if(status.changePath) window.history.pushState({} , "" , `/admin/data?${status.status}`)

        setList(<></>)
        LoadPageData()
        removePopup()

        console.log(status.status)
    } , [status])

    const removePopup = () => {
        if(RefPopup.current) {
            RefPopup.current.removeAttribute("style")
            setTimeout(()=>{
                setBecause(<></>)
            } , 500)
        }
    }

    const fetchDataList = async () => {
        
    }

    return(
        <section className="body-list-doctor">
            <InsertPage PageAddRef={PageAddRef} type={status.status}/>
            <div className="List-doctor" ref={ListRef}>
                {List}
            </div>
            <div ref={RefPopup} className="page-because-popup">
                {Because}
            </div>
        </section>
    )
}

const InsertPage = ({PageAddRef , type}) => {

    const [Open , setOpen] = useState(0)
    const [Text , setText] = useState("")
    const [Status , setStatus] = useState(0)

    const [sizeReport , setSize] = useState(0)

    const uDoctor = useRef()
    const pwDoctor = useRef()
    const pwAdmin = useRef()

    useEffect(()=>{
        setSize(PageAddRef.current.clientHeight * 0.3)
    } , [])

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

export default ListData