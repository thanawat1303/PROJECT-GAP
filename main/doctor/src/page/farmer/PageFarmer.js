import React, { useEffect , useState , useRef } from "react";
import { clientMo } from "../../../../../src/assets/js/moduleClient";
import "../../assets/style/page/farmer/PageFarmer.scss"
const PageFarmer = ({setMain , session , socket , type = 0 , eleImageCover , LoadType , eleBody , setTextStatus}) => {
    const [statusPage , setStatus] = useState({
        status : LoadType.split(":")[0],
        open : type
    })

    const SelectOption = useRef()

    useEffect(()=>{
        eleImageCover.current.style.height = "30%"
        eleBody.current.style.height = "70%"
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
                    <option value={"ap"}>ทั้งหมด</option>
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
    
    useEffect(()=>{
        setBody(<></>)
        FetchList()
    } , [status])

    const FetchList = async () => {
        try {
            if(status.open === 1) window.history.pushState({} , "" , `/doctor/farmer/${status.status}`)
            const list = await clientMo.post('/api/doctor/farmer/list' , {approve:(status.status == "wt") ? 0 : 1})
            let data = JSON.parse(list)
            if(data.length !== 0) {
                const body = data.map((val , key)=>{
                    const base64String = String.fromCharCode(...val.img.data); // แปลง charCode เป็น string
                    return (
                        <section key={key} className="list-some-farmer" item={val.id_table}>
                            <div className="img">
                                <img src={base64String}></img>
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
                
        } catch(e) {
            session()
        }
    }

    return (Body)
}

export default PageFarmer