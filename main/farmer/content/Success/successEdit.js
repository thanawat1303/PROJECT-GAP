// import React, { useEffect, useRef, useState } from "react";
// import { clientMo } from "../../../../src/assets/js/moduleClient";
// import { CloseAccount } from "../../method";
// import MenuPlant from "../PlantList/MenuPlant";

// import "./assets/Success.scss"
// import { DayJSX, Loading } from "../../../../src/assets/js/module";

// const Success = ({ setBody , id_house , id_plant , liff , setPage , isClick = 0}) => {
//     const Popup = useRef()
//     const [List , setList] = useState(<></>)
//     const [PopupState , setPopup] = useState(<></>)

//     useEffect(()=>{
//         setPage("Success")
//         if(isClick === 1) window.history.pushState({} , null , `/farmer/form/${id_house}/s/${id_plant}`)

//         FetchData()
//     } , [])

//     const FetchData = async () => {
//         const result = await clientMo.post("/api/farmer/success/list" , {id_farmhouse : id_house , id_plant : id_plant})
//         if(await CloseAccount(result , setPage)) {
//             const ObjectData = JSON.parse(result)
//             setList(ObjectData.map((val , key)=>{
//                 return <div key={key} className={`list-in-success ${val.id}`}>
//                             <div className="row first">
//                                 <div className="type-head">{val.type_success ? "เก็บผลผลิต" : "เก็บผลตัวอย่าง"}</div>
//                                 <div className="date">
//                                     <DayJSX DATE={val.date_of_doctor} TYPE="normal"/>
//                                 </div>
//                             </div>
//                             <div className="row second">
//                                 <div className="station">
//                                     <span>ศูนย์</span>
//                                     <div>{val.name_station}</div>
//                                 </div>
//                                 <div className="bt">
//                                     <button onClick={(e)=>OpenPopup(val.id , val.type_success , val.name_station , e)}>{val.date_of_farmer ? "แสดงรหัส" : "ยืนยัน"}</button>
//                                 </div>
//                             </div>
//                         </div>
//             }))
//         }
//         if(document.getElementById("loading").classList[0] !== "hide")
//             clientMo.unLoadingPage()
//     }

//     const OpenPopup = async (id_table_success , type , name_station , Dom) => {
//         const result = await clientMo.post("/api/farmer/success/get" , {
//             id_farmhouse : id_house , id_plant : id_plant , id_table : id_table_success
//         })
//         if(await CloseAccount(result , setPage)) {
//             const ob = JSON.parse(result)
//             if(ob[0]) setPopup(<PopupSuccess Ref={Popup} setPopup={setPopup}
//                                     Data={{
//                                         id_success : ob[0].id_success,
//                                         name_station : name_station
//                                     }} />)
//             else setPopup(<PopupSuccess Ref={Popup} setPopup={setPopup} setPage={setPage} Dom={Dom}
//                             Data={{
//                                 id_table : id_table_success,
//                                 type : type,
//                                 name_station : name_station
//                             }} 
//                             MainData={{
//                                 id_house : id_house,
//                                 id_plant : id_plant
//                             }}/>)
//         }
//     }

//     const ReturnPage = async () =>{
//         const result = await clientMo.post("/api/farmer/account/check")
//         if(await CloseAccount(result , setPage)) {
//             setBody(<MenuPlant setBody={setBody} setPage={setPage} id_house={id_house} id_plant={id_plant} isClick={1} liff={liff} />)
//         }
//     }

//     return (<>
//             <div className="body-success">
//                 <div className="head">
//                     <div className="return" onClick={ReturnPage}>
//                         <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
//                             <g fillRule="evenodd">
//                                 <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"/>
//                                 <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"/>
//                             </g>
//                         </svg>
//                     </div>
//                     <span>การเก็บเกี่ยว</span>
//                 </div>
//                 <div className="content-success">
//                     <div className="list-success">
//                         {List}
//                     </div>
//                 </div>
//                 <div ref={Popup} className="popup">
//                     {PopupState}
//                 </div>
//             </div>
//             </>
//             )
// }

// const PopupSuccess = ({Ref , setPopup , setPage , Dom ,
// Data = {type : "" , id_table : "" , id_success : "" , name_station : ""} , 
// MainData = {id_plant : "" , id_house : ""}}) => {
    
//     const [Load , setLoad] = useState(false)
    
//     useEffect(()=>{
//         Ref.current.setAttribute("show" , "")
//     } , [])

//     const cancel = () => {
//         Ref.current.removeAttribute("show")
//         setTimeout(()=>{
//             setPopup(<></>)
//         } , 500)
//     }

//     const Confirm = async () => {
//         const data = {
//             id_farmhouse : MainData.id_house,
//             id_plant : MainData.id_plant,
//             id_table_success : Data.id_table,
//         }

//         setLoad(true)
//         const result = await clientMo.post("/api/farmer/success/update" , data)
//         if(await CloseAccount(result , setPage)){
//             Dom.target.innerHTML = "แสดงรหัส"
//             cancel()
//         }
//     }

//     return(
//         <section className="detail-popup">
//             <div className="head-content">
//                 <div className="head-popup">{Data.id_success ? Data.id_success : Data.type ? "เก็บผลผลิต" : "เก็บผลตัวอย่าง"}</div>
//                 { Data.id_success ? <></> :
//                     <div className="content-load">
//                         {Load ? <Loading size={"1.5em"} border={"2vw"} color="green" animetion={true}/> : <></>}
//                     </div>
//                 }
//             </div>
//             <div className="report-alert">
//                 {Data.id_success ? `* รหัสนี้สำหรับแนบกับผลผลิตเพื่อนำส่งศูนย์${Data.name_station}` : `* เมื่อกดยืนยัน จะแสดงปุ่มเพื่อแสดงรหัสสำหรับแนบกับผลผลิตส่งให้ทางศูนย์${Data.name_station}`}
//             </div>
//             <div className="bt">
//                 <button style={{backgroundColor : Data.id_success ? "green" : "red" , color : "white"}} onClick={cancel}>{Data.id_success ? "ตกลง" : "ยกเลิก"}</button>
//                 { Data.id_success ? <></>
//                     : <button style={{backgroundColor : "green" , color : "white"}} onClick={Confirm}>ยืนยัน</button>
//                 }
//             </div>
//         </section>
//     )
// }

// export default Success