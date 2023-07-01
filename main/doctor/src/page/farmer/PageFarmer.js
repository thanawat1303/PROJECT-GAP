import React, { useEffect , useState , useRef, useCallback } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/farmer/PageFarmer.scss"
import { DayJSX, LoadOtherDom, Loading, PopupDom, TimeJSX } from "../../../../../src/assets/js/module";
import ManagePopup from "./ManagePopup";
const PageFarmer = ({setMain , session , socket , type = 0 , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    const [statusPage , setStatus] = useState({
        status : LoadType.split(":")[0],
        open : type
    })

    const SelectOption = useRef()

    useEffect(()=>{
        eleImageCover.current.style.height = "40%"
        eleBody.current.style.height = "60%"
        setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , "ตรวจสอบแล้ว"])
        clientMo.unLoadingPage()

        if(LoadType.split(":")[1] === "pop")
            chkPath()
    } , [LoadType])

    const chkPath = () => {
        if(LoadType.split(":")[0] === "ap") {
            setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , "ตรวจสอบแล้ว"])
            setStatus({
                status : "ap",
                open : 0
            })
        }
        else if(LoadType.split(":")[0] === "wt") {
            setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , "รอการตรวจสอบ"])
            setStatus({
                status : "wt",
                open : 0
            })
        }
            
    }

    const changeMenu = (e) => {
        // const typeClick = statusPage.status === "ap" ? "wt" : "ap"
        if(e.target.value !== statusPage.status) {
            setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , (e.target.value === "ap") ? "ตรวจสอบแล้ว" : "รอการตรวจสอบ"])
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

    const [LoadingList , setLoadList ] = useState(true)
    
    useEffect(()=>{
        setBody(<></>)
        setLoadList(true)

        FetchList(10)
    } , [status])

    const FetchList = async (limit) => {
        try {
            if(status.open === 1) window.history.pushState({} , "" , `/doctor/farmer/${status.status}`)
            const list = await clientMo.post('/api/doctor/farmer/list' , {approve:(status.status == "wt") ? 0 : 1 , limit : limit})
            let data = JSON.parse(list)
            setData(data)
            setLoadList(false)
            return data
        } catch(e) {
            session()
        }
    }

    return (LoadingList ?
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}>
                    <Loading size={"45px"} border={"5px"} color="rgb(24 157 133)" animetion={true}/>
                </div> 
                :
                <ManageList Data={Data} status={status} session={session} fetch={FetchList} count={Count} setCount={setCount}/>)
}

const ManageList = ({Data , status , session , fetch , count , setCount}) => {
    const [Body , setBody] = useState(<></>)
    const RefPop = useRef()
    const [PopBody , setPop] = useState(<></>)
    
    let refData = Data.map(() => React.createRef());

    useEffect(()=>{
        refData = Data.map(() => React.createRef());
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

            let countKey = 0
            const body = Row.map((Data , keyRow)=>{
                return (
                    <section className={`row ${keyRow}`} key={keyRow}>
                        <div className="row-content" style={{
                            '--item-in-row-doctor' : `${Max}`,
                            '--margin-in-row-doctor' : '16px',
                            '--font-size-in-row-doctor' : `${SizeFont}vw`,
                            '--font-size-date-in-row-doctor' : `${SizeFontDate}vw`,
                            }}>
                            {
                                Data.map((val , key)=>{
                                    const base64String = String.fromCharCode(...val.img.data); // แปลง charCode เป็น string
                                    const Ref = refData[countKey]
                                    countKey++
                                    return (
                                        <section key={key} className="list-some-farmer"
                                            ref={Ref}
                                            >
                                            <div className="img">
                                                <img src={base64String}></img>
                                            </div>
                                            <div className="detail">
                                                <div className="text fullname">
                                                    <input readOnly value={val.fullname}></input>
                                                </div>
                                                {
                                                    status.status === "ap" ? 
                                                    <div className="flex">
                                                        <span>ตรวจสอบโดย</span>
                                                        <div>{val.name_doctor}</div> 
                                                    </div>
                                                    : <></>
                                                }
                                                {
                                                    status.status === "ap" ?
                                                    <div className="flex">
                                                        <span>วันที่อนุมัติ</span>
                                                        <DayJSX DATE={val.date_register} TYPE="small"/>
                                                    </div>
                                                    :
                                                    <div className="text date">
                                                        <DayJSX DATE={val.date_register} TYPE="normal"/>
                                                        <TimeJSX DATE={val.date_register} MAX={false}/>
                                                    </div>
                                                }
                                            </div>
                                            <div className="bt">
                                                <button onClick={()=>showPopup(val.id_table , val.link_user , Ref)}>{status.status === "ap" ? "ดูข้อมูล" : "ตรวจสอบ"}</button>
                                            </div>
                                            { status.status === "ap" ?
                                                <div className="count-account" show={val.Count !== 1 ? "s" : ""}>
                                                    {val.Count !== 1 ? val.Count : ""}
                                                </div> : <></>
                                            }
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

    const showPopup = async (id_table , link_user , Ref) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setPop(<ManagePopup RefData={Ref} setPopup={setPop} RefPop={RefPop} resultPage={{
                id_table : id_table ,
                link_user : link_user
            }} status={status.status} session={session} countLoad={count} Fecth={fetch}/>)
        else session()
    }

    return(
        <>
        <div className="body-farmer">
            {Body}
        </div>
        <div className="footer">
            <LoadOtherDom Fetch={fetch} count={count} setCount={setCount} Limit={5}
                            style={{backgroundColor : "rgb(24 157 133)"}}/>
            <div id="popup-detail-farmer">
                <PopupDom Ref={RefPop} Body={PopBody} zIndex={2}/>
            </div>
        </div>
        </>
    )
}

export default PageFarmer