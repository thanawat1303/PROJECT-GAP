import React, { useEffect , useState , useRef, useCallback } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/farmer/PageFarmer.scss"
import "../../assets/style/TemplantList.scss"
import { DayJSX, LoadOtherDom, Loading, PopupDom, TimeJSX } from "../../../../../src/assets/js/module";

import ManagePopup from "./ManagePopup";
import ListProfile from "./ListProfile";
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
        } else if(LoadType.split(":")[0] === "not") {
            setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , "บัญชีที่ถูกปิด"])
            setStatus({
                status : "not",
                open : 0
            })
        }
            
    }

    const changeMenu = (e) => {
        // const typeClick = statusPage.status === "ap" ? "wt" : "ap"
        if(e.target.value !== statusPage.status) {
            setTextStatus(["หน้าหลัก" , "ทะเบียนเกษตรกร" , (e.target.value === "ap") ? "ตรวจสอบแล้ว" : (e.target.value === "wt") ? "รอการตรวจสอบ" : (e.target.value === "not") ? "บัญชีที่ถูกปิด" : ""])
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
        <section className="data-list-content-page">
            <div ref={SelectOption} className="bt-action">
                <div onClick={OptionSelect}>ตัวเลือก</div>
                <select value={statusPage.status} onChange={changeMenu}>
                    <option value={"ap"}>ตรวจสอบแล้ว</option>
                    <option value={"wt"}>ยังไม่ตรวจสอบ</option>
                    <option value={"not"}>บัญชีที่ถูกปิด</option>
                </select>
            </div>
            <div className="data-list-content">
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

        StartList(status)
        
        // socket.removeListener("reload-farmer-list")
        // return(()=>{
        //     socket.removeListener("reload-farmer-list")
        // })
    } , [status])

    // useEffect(()=>{
    //     socket.removeListener("reload-farmer-list")
    //     socket.on("reload-farmer-list" , ()=>{
    //         console.log(123)
    //         FetchList(Count)
    //     })
    // } , [Count , status])

    const FetchList = async (limit) => {
        try {
            const list = await clientMo.post('/api/doctor/farmer/list' , {approve:(status.status == "wt") ? 0 : (status.status == "ap") ? 1 : 2 , limit : limit})
            const data = JSON.parse(list)
            setData(data)
            setLoadList(false)
            return data
        } catch(e) {
            session()
        }
    }

    const StartList = async (status) => {
        await FetchList(10)
        if(status.open === 1) window.history.pushState({} , "" , `/doctor/farmer/${status.status}`)
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
                <ManageList Data={Data} status={status} session={session} fetch={FetchList} count={Count} setCount={setCount} socket={socket}/>
                )
}

const ManageList = ({Data , status , session , fetch , count , setCount , socket}) => {
    const [Body , setBody] = useState(<></>)
    const RefPop = useRef()
    const [PopBody , setPop] = useState(<></>)
    
    // let refData = Data.map(() => React.createRef());

    useEffect(()=>{
        // refData = Data.map(() => React.createRef());
        ManageShow(Data)

        // window.addEventListener("resize" , Resize)

        // return (() => {
        //     window.removeEventListener("resize" , Resize)
        // })
    } , [Data])

    const Resize = () => ManageShow(Data)

    const ManageShow = async (Data) => {
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

            const body = Row.map((Data , keyRow)=>{
                console.log(Data)
                return (
                    <section className={`row ${keyRow}`} key={keyRow}>
                        <div className="row-content" style={{
                            '--item-in-row-doctor' : `${Max}`,
                            '--margin-in-row-doctor' : '16px',
                            '--font-size-in-row-doctor' : `${SizeFont}vw`,
                            '--font-size-date-in-row-doctor' : `${SizeFontDate}vw`,
                            }}>
                            {
                                Data.map((val)=>{
                                    return (
                                        <section key={val.id_table} className="list-some-data-on-page">
                                            <div className="img">
                                                {/* <img src={String.fromCharCode(...val.img.data)}></img> */}
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
                                                        <DayJSX DATE={val.date_doctor_confirm} TYPE="small"/>
                                                    </div>
                                                    :
                                                    <div className="text date">
                                                        <DayJSX DATE={val.date_register} TYPE="normal"/>
                                                        <TimeJSX DATE={val.date_register} MAX={false}/>
                                                    </div>
                                                }
                                            </div>
                                            <div className="bt">
                                                <button onClick={()=>showPopup(val.id_table , val.link_user)}>{status.status === "ap" ? "ดูข้อมูล" : "ตรวจสอบ"}</button>
                                            </div>
                                            { val.is_msg ?
                                                <div className="count-msg">
                                                    <svg viewBox="0 0 48 48">
                                                        <path d="M 23.007812 5 C 20.430604 5 17.955216 5.3826911 15.664062 6.0859375 A 1.50015 1.50015 0 1 0 16.544922 8.953125 C 18.547769 8.3383714 20.727023 8 23.007812 8 C 33.10213 8 41.005859 14.567511 41.005859 22.236328 C 41.005859 25.967632 39.339349 29.098942 36.613281 31.976562 A 1.50015 1.50015 0 1 0 38.791016 34.039062 C 41.856948 30.802683 44.005859 26.879024 44.005859 22.236328 C 44.005859 12.551146 34.415497 5 23.007812 5 z M 7.2363281 11.515625 A 1.50015 1.50015 0 0 0 6.0820312 12.03125 C 3.5472914 14.857327 2.0058594 18.403085 2.0058594 22.236328 C 2.0058594 30.874232 9.6073525 37.884555 19.505859 39.232422 C 19.733605 39.281857 19.977406 39.361175 20.132812 39.429688 C 20.118043 39.515147 20.153199 39.911316 20.105469 40.273438 C 20.105469 40.273438 20.105469 40.275391 20.105469 40.275391 C 20.092619 40.352451 19.881057 41.615404 19.835938 41.878906 L 19.837891 41.876953 C 19.762771 42.309977 19.521995 43.033546 20.193359 44.048828 C 20.529042 44.556469 21.285396 44.987587 21.962891 45 C 22.640385 45.01241 23.208997 44.789728 23.832031 44.447266 C 26.686076 42.87719 29.695889 41.176108 32.503906 39.255859 A 1.50015 1.50015 0 1 0 30.810547 36.779297 C 28.322739 38.480572 25.598464 40.016715 22.943359 41.484375 C 22.999979 41.145402 23.072266 40.71875 23.072266 40.71875 A 1.50015 1.50015 0 0 0 23.080078 40.671875 C 23.155098 40.109193 23.364983 39.264995 22.923828 38.162109 A 1.50015 1.50015 0 0 0 22.921875 38.158203 C 22.588283 37.333404 21.970623 36.974887 21.476562 36.738281 C 20.982502 36.501675 20.514934 36.37997 20.126953 36.296875 A 1.50015 1.50015 0 0 0 20.007812 36.277344 C 11.219455 35.120988 5.0058594 29.123568 5.0058594 22.236328 C 5.0058594 19.201571 6.2051462 16.387126 8.3164062 14.033203 A 1.50015 1.50015 0 0 0 7.2363281 11.515625 z M 18.333984 17.136719 C 17.769984 17.136719 17.310547 17.592344 17.310547 18.152344 L 17.310547 25.845703 C 17.310547 26.406703 17.768984 26.861328 18.333984 26.861328 C 18.897984 26.861328 19.357422 26.405703 19.357422 25.845703 L 19.357422 18.152344 C 19.357422 17.592344 18.898984 17.136719 18.333984 17.136719 z M 21.853516 17.136719 C 21.743516 17.136719 21.633344 17.154453 21.527344 17.189453 C 21.109344 17.328453 20.828125 17.715344 20.828125 18.152344 L 20.828125 25.845703 C 20.828125 26.406703 21.288516 26.861328 21.853516 26.861328 C 22.419516 26.861328 22.878906 26.405703 22.878906 25.845703 L 22.878906 21.087891 L 26.853516 26.455078 C 27.045516 26.709078 27.351875 26.861328 27.671875 26.861328 C 27.780875 26.861328 27.890094 26.843594 27.996094 26.808594 C 28.416094 26.671594 28.697266 26.284703 28.697266 25.845703 L 28.697266 18.150391 C 28.697266 17.590391 28.238828 17.136719 27.673828 17.136719 C 27.108828 17.136719 26.648438 17.590391 26.648438 18.150391 L 26.648438 22.912109 L 22.671875 17.542969 C 22.479875 17.288969 22.172516 17.136719 21.853516 17.136719 z M 11.466797 17.138672 C 10.902797 17.138672 10.443359 17.592344 10.443359 18.152344 L 10.443359 25.847656 C 10.443359 26.408656 10.901797 26.863281 11.466797 26.863281 L 15.345703 26.863281 C 15.910703 26.863281 16.368187 26.405703 16.367188 25.845703 C 16.367188 25.285703 15.910703 24.830078 15.345703 24.830078 L 12.488281 24.830078 L 12.488281 18.152344 C 12.488281 17.592344 12.031797 17.138672 11.466797 17.138672 z M 31.095703 17.138672 C 30.531703 17.138672 30.072266 17.594297 30.072266 18.154297 L 30.072266 18.15625 L 30.072266 21.998047 L 30.072266 22 L 30.072266 22.001953 L 30.072266 25.845703 C 30.072266 26.406703 30.532703 26.861328 31.095703 26.861328 L 34.974609 26.861328 C 35.539609 26.861328 36 26.405703 36 25.845703 C 36 25.285703 35.539609 24.830078 34.974609 24.830078 L 32.119141 24.830078 L 32.119141 23.013672 L 34.974609 23.013672 C 35.540609 23.013672 36 22.558047 36 21.998047 C 36 21.437047 35.539609 20.982422 34.974609 20.982422 L 34.974609 20.986328 L 32.119141 20.986328 L 32.119141 19.169922 L 34.974609 19.169922 C 35.540609 19.169922 36 18.714297 36 18.154297 C 36 17.594297 35.539609 17.138672 34.974609 17.138672 L 31.095703 17.138672 z"/>
                                                    </svg>
                                                </div>
                                                : <></>
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
                    <div style={{textAlign : "center" , fontFamily : "Sans-font" , fontWeight : 900 , fontSize : "18px"}}>ไม่พบข้อมูล</div>
                </section>
            )
        }
    }

    const showPopup = async (id_table , link_user) => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) 
            setPop(<ManagePopup setPopup={setPop} RefPop={RefPop} resultPage={{
                id_table : id_table ,
                link_user : link_user
            }} status={status.status} session={session} countLoad={count} Fecth={fetch} socket={socket}/>)
        else session()
    }

    return(
        <>
        <div className="body-page-content">
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