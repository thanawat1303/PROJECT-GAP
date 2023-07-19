import React, { useEffect, useRef, useState } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/TemplantList.scss"
import "../../assets/style/page/data/PageData.scss"
import { DayJSX , LoadOtherDom, Loading, PopupDom } from "../../../../../src/assets/js/module";

const PageData = ({setMain , session , socket , type = false , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    // const [Body , setBody] = useState(<></>)
    const [Loading , setLoading] = useState(false)
    // const [statusPage , setStatus] = useState({
    //     status : LoadType.split(":")[0],
    //     open : type
    // })
    const [TypeSelectMenu , setTypeSelectMenu] = useState(0)
    const [DataProcess , setDataProcess] = useState(new Map([
        ["type" , LoadType] , //Loadtype 0 : plant , 1 : ferti , 2 : chemi , 3 : source
        // ["name" , ""] ,
        ["statusClick" , type]
    ]))


    const Search = useRef()
    const SearchInput = useRef()
    
    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
        clientMo.unLoadingPage()

    } , [LoadType])

    const OpenOption = (Ref , option) => {
        setTypeSelectMenu(option)
        if(TypeSelectMenu == option) Ref.current.toggleAttribute("show")
        else if(Ref.current.getAttribute("show") == null) Ref.current.toggleAttribute("show")
    }

    const searchList = (e , keyMap) => {
        
    }

    return(
        <section className="data-list-content-page data-page">
            <div className="search-form" ref={Search}>
                <div className="bt-select-option">
                    <a title="ค้นหา" className="bt-search-show" onClick={()=>OpenOption(Search , 0)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                                <path d="m11.25 11.25l3 3"/>
                                <circle cx="7.5" cy="7.5" r="4.75"/>
                            </g>
                        </svg>
                    </a>
                    <a style={{padding : "0"}} title="เพิ่มข้อมูล" className="bt-search-show" onClick={()=>OpenOption(Search , 1)}>
                        <svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 2A14.172 14.172 0 0 0 2 16a14.172 14.172 0 0 0 14 14a14.172 14.172 0 0 0 14-14A14.172 14.172 0 0 0 16 2Zm8 15h-7v7h-2v-7H8v-2h7V8h2v7h7Z"/><path fill="none" d="M24 17h-7v7h-2v-7H8v-2h7V8h2v7h7v2z"/></svg>
                    </a>
                </div>
                <div className="content-option">
                    <div className="field-option">
                        { TypeSelectMenu ? 
                            <></>
                            :<></>

                        }
                    </div>
                </div>
            </div>
            <div className="data-list-content">
                <List session={session} socket={socket} DataFillter={DataProcess} setTextStatus={setTextStatus}/>
            </div>
        </section>
    )
}

const List = ({ session , socket , DataFillter , setTextStatus}) => {
    const [Data , setData] = useState([])
    const [Count , setCount] = useState(10)
    const [timeOut , setTimeOut] = useState()
    const [LoadingList , setLoadList ] = useState(true)
    
    useEffect(()=>{
        setLoadList(true)

        setTextStatus(["หน้าหลัก" , "ข้อมูล" , 
            DataFillter.get("type") === "plant" ? "รายการชนิดพืช" : 
            DataFillter.get("type") === "fertilizer" ? "รายการปุ๋ย" : 
            DataFillter.get("type") === "chemical" ? "รายการสารเคมี" :
            DataFillter.get("type") === "source" ? "รายการแหล่งที่ซื้อ" : ""
        ])

        clearTimeout(timeOut)
        setTimeOut(setTimeout(()=>{
            FetchList(10)
        } , 1500))

    } , [DataFillter])

    const FetchList = async (Limit) => {
        try {
            let JsonData = {}
            const stringUrl = new Array
            DataFillter.forEach((data , key)=>{
                if(key != "statusClick") { 
                    JsonData[key] = data 
                    stringUrl.push(`${key}=${data}`)
                }
            })

            if(DataFillter.get("statusClick")) window.history.pushState({} , "" , `/doctor/form${stringUrl.join("&") ? `?${stringUrl.join("&")}` : ""}`)

            const list = await clientMo.get(`/api/doctor/data/get?${stringUrl.join("&")}&limit=${Limit}`)
            const data = JSON.parse(list)
            console.log(data)

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
        <ManageList Data={Data} session={session} fetch={FetchList} count={Count} setCount={setCount}/>)
}

const ManageList = ({Data , session , fetch , count , setCount}) => {
    const [Body , setBody] = useState(<></>)
    const RefPop = useRef()
    const [PopBody , setPop] = useState(<></>)
    
    let refData = Data.map(() => React.createRef());

    useEffect(()=>{
        refData = Data.map(() => React.createRef());
        ManageShow(Data)

        // window.addEventListener("resize" , Resize)

        // return () => {
        //     window.removeEventListener("resize" , Resize)
        // }
    } , [Data])

    // const Resize = () => ManageShow(Data)

    const ManageShow = (Data) => {
        if(Data.length !== 0) {
            // let Max = 0 , SizeFont = 0 , SizeFontDate = 0
            // // console.log(Data)
            // if(window.innerWidth >= 920) {
            //     Max = 4
            //     SizeFont = 1.8
            //     SizeFontDate = 1.2
            // }
            // else if (window.innerWidth < 920) {
            //     Max = 2
            //     SizeFont = 2.8
            //     SizeFontDate = 1.8
            // }

            // // const text = [ ...Data , ...Data , ...Data ]
            // const Row = new Array
            // for(let x = 0 ; x < Data.length ; x += Max) Row.push(Data.slice(x , Max + x))

            // let countKey = 0
            const body = Data.map((Data , keyRow)=>{
                const Ref = refData[keyRow]
                return (
                    <a key={keyRow} className="list-some-data-on-page"
                        ref={Ref} status={Data.is_use}
                        >
                        <div className="frame-data-list">
                            
                        </div>
                    </a>
                    // <section className={`row ${keyRow}`} key={keyRow}>
                    //     <div className="row-content" style={{
                    //         '--item-in-row-doctor' : `${Max}`,
                    //         '--margin-in-row-doctor' : '10px',
                    //         '--font-size-in-row-doctor' : `${SizeFont}vw`,
                    //         '--font-size-date-in-row-doctor' : `${SizeFontDate}vw`,
                    //         }}>
                    //         {
                    //             Data.map((val , key)=>{
                    //                 const Ref = refData[countKey]
                    //                 countKey++
                    //                 return (
                    //                     <section key={key} className="list-some-data-on-page"
                    //                         ref={Ref}
                    //                         >
                    //                         <div className="frame-data-list">
                    //                             <div className="inrow">
                    //                                 <div className="type-main">
                    //                                     {val.type_main}
                    //                                 </div>
                    //                                 <div className="type">
                    //                                     {val.name_plant}
                    //                                 </div>
                    //                                 <div className="date">
                    //                                     <span>ปลูก</span>
                    //                                     <DayJSX DATE={val.date_plant} TYPE="SMALL"/>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="inrow">
                    //                                 <div className="system-glow">
                    //                                     ระบบการปลูก {val.system_glow}
                    //                                 </div>
                    //                                 <div className="factor">
                    //                                     <span>
                    //                                         ปุ๋ย {val.ctFer} ครั้ง
                    //                                     </span>
                    //                                     <span className="dot">|</span>
                    //                                     <span>
                    //                                         สารเคมี {val.ctChe} ครั้ง
                    //                                     </span>
                    //                                 </div>
                    //                             </div>
                    //                             <div className="inrow">
                    //                                 <div className="insect">
                    //                                     ศัตรูพืช {val.insect}
                    //                                 </div>
                    //                                 <div className="factor">
                    //                                     <span className="generation">
                    //                                         รุ่น {val.generation}
                    //                                     </span>
                    //                                     <span className="qty">
                    //                                         จำนวน {val.qty} ต้น
                    //                                     </span>
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                     </section>
                    //                 )
                    //             })
                    //         }
                    //     </div>
                    // </section>
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

    return(
        <>
        <div className="body-page-content">
            {Body}
        </div>
        <div className="footer">
            <LoadOtherDom Fetch={fetch} count={count} setCount={setCount} Limit={5}
                            style={{backgroundColor : "rgb(24 157 133)"}}/>
            <div id="popup-detail-form">
                <PopupDom Ref={RefPop} Body={PopBody} zIndex={2}/>
            </div>
        </div>
        </>
    )
} 

export default PageData