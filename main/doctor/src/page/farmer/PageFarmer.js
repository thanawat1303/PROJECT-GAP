import React, { useEffect , useState , useRef } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/farmer/PageFarmer.scss"
import { DayJSX, LoadOtherDom, PopupDom, TimeJSX } from "../../../../../src/assets/js/module";
import ManagePopup from "./ManagePopup";
const PageFarmer = ({setMain , session , socket , type = 0 , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    const [statusPage , setStatus] = useState({
        status : LoadType.split(":")[0],
        open : type
    })

    const SelectOption = useRef()
    const PopupRef = 

    useEffect(()=>{
        eleImageCover.current.style.height = "40%"
        eleBody.current.style.height = "60%"
        setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร"])
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

    const changeMenu = (e) => {
        // const typeClick = statusPage.status === "ap" ? "wt" : "ap"
        if(e.target.value !== statusPage.status) {
            setStatus({
                status : e.target.value,
                open : 1
            })
        }
    }

    const OptionSelect = () => {
        SelectOption.current.toggleAttribute("show")
    } 

    return(
        <section className="farmer-list-page">
            <div ref={SelectOption} className="bt-action">
                <div onClick={OptionSelect}>ตัวเลือก</div>
                <select value={statusPage.status} onChange={changeMenu}>
                    <option value={"ap"}>ตรวจสอบแล้ว</option>
                    <option value={"wt"}>ยังไม่ตรวจสอบ</option>
                </select>
            </div>
            <div className="farmer-list">
                <List session={session} socket={socket} status={statusPage}/>
            </div>
        </section>
    )

}

const List = ({ session , socket , status}) => {
    const [Body , setBody] = useState(<></>)
    const [Data , setData] = useState([])
    const [Count , setCount] = useState(10)
    
    useEffect(()=>{
        setBody(<></>)
        FetchList(10)
    } , [status])

    const FetchList = async (limit) => {
        try {
            if(status.open === 1) window.history.pushState({} , "" , `/doctor/farmer/${status.status}`)
            const list = await clientMo.post('/api/doctor/farmer/list' , {approve:(status.status == "wt") ? 0 : 1 , limit : limit})
            let data = JSON.parse(list)
            setData(data)
            return true
        } catch(e) {
            session()
        }
    }

    return (<ManageList Data={Data} status={status} session={session} fetch={FetchList} count={Count} setCount={setCount}/>)
}

const ManageList = ({Data , status , session , fetch , count , setCount}) => {
    const [Body , setBody] = useState(<></>)
    const RefPop = useRef()
    const [PopBody , setPop] = useState(<></>)

    useEffect(()=>{
        ManageShow(Data)
        window.addEventListener("resize" , Resize)

        return () => {
            window.removeEventListener("resize" , Resize)
        }
    } , [Data])

    const Resize = () => ManageShow(Data)

    const ManageShow = (Data) => {
        if(Data.length !== 0) {
            let Max = 0 , SizeFont = 0 , SizeFontDate = 0
            // console.log(Data)
            if(window.innerWidth >= 920) {
                Max = 3
                SizeFont = 1.8
                SizeFontDate = 1.2
            }
            else if (window.innerWidth < 920) {
                Max = 2
                SizeFont = 2.8
                SizeFontDate = 1.8
            }

            // const text = [ ...Data , ...Data , ...Data ]
            const Row = new Array
            for(let x = 0 ; x < Data.length ; x += Max) Row.push(Data.slice(x , Max + x))
            const body = Row.map((Data , key)=>{
                return (
                    <section className={`row ${key}`} key={key}>
                        <div className="row-content" style={{
                            '--item-in-row-doctor' : `${Max}`,
                            '--margin-in-row-doctor' : '16px',
                            '--font-size-in-row-doctor' : `${SizeFont}vw`,
                            '--font-size-date-in-row-doctor' : `${SizeFontDate}vw`,
                            }}>
                            {
                                Data.map((val , key)=>{
                                    const base64String = String.fromCharCode(...val.img.data); // แปลง charCode เป็น string
                                    return (
                                        <section key={key} className="list-some-farmer" item={val.id_table}>
                                            <div className="img">
                                                <img src={base64String}></img>
                                            </div>
                                            <div className="detail">
                                                <div className="text fullname">
                                                    <input readOnly value={val.fullname}></input>
                                                </div>
                                                {/* <div className="line"></div> */}
                                                <div className="text date">
                                                    <DayJSX DATE={val.date_register} TYPE="normal"/>
                                                    <TimeJSX DATE={val.date_register} MAX={false}/>
                                                </div>
                                            </div>
                                            <div className="bt">
                                                <button onClick={()=>showPopup(val.id_table)}>ตรวจสอบ</button>
                                            </div>
                                        </section>
                                    )
                                })
                            }
                        </div>
                    </section>
                )
            })
            setBody(body)
        } else {
            setBody(
                <section>
                    <div>ไม่พบข้อมูล</div>
                </section>
            )
        }
    }

    const showPopup = async (id_table , link_user) => {
        try {
            const Data = (status.status === "ap") ?
                            await clientMo.post("/api/doctor/farmer/get/count" , {link_user : link_user , auth : 1})
                            : await clientMo.post("/api/doctor/farmer/get/count" , {id_table : id_table , auth : 0})
            const result = JSON.parse(Data)
            setPop(<ManagePopup setPopup={setPop} RefPop={RefPop} result={result} status={status.status} session={session} countLoad={count} Fecth={fetch}/>)
        } catch(e) {
            session()
        }
    }

    return(
        <>
        {Body}
        <LoadOtherDom Fetch={fetch} count={count} setCount={setCount} Limit={5}
                        style={{backgroundColor : "rgb(24 157 133)"}}/>
        <div id="popup-detail-farmer">
            <PopupDom Ref={RefPop} Body={PopBody} zIndex={2}/>
        </div>
        </>
    )
}

export default PageFarmer