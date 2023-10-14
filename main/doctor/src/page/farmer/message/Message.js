import React , {useState , useRef , useEffect} from "react"
import io from "socket.io-client"
import { clientMo } from "../../../../../../src/assets/js/moduleClient"
import { DownLoadImage, Loading, OpenImageMax, PopupDom } from "../../../../../../src/assets/js/module"
const Messageing = ({Data , FetData , session , socket = io() , is_change}) => {
    const [message , SetMessage] = useState([])
    const [Startmessage , SetStartMessage] = useState(false)
    const [timeOut , settimeOut] = useState(0)
    const [Size_input , setSize_input] = useState(30)

    const [Open , setOpen] = useState(false)
    const [getLoadMsg , setLoadMsg] = useState(false)
    const [FocusUnread , setFocusUnread] = useState("start")

    const messageRef = useRef()
    const ScrollRef = useRef()
    const Unread = useRef()

    const TextSend = useRef()
    const [BtSend , setBtSend] = useState(false)

    const RefOpenImg = useRef()
    const [getImageShow , setImageShow] = useState(<></>)

    useEffect(()=>{
        clearTimeout(timeOut)
        setFocusUnread("start")
        setOpen(false)
        SetStartMessage(false)
        onMessage()
    } , [])

    useEffect(()=>{
        return(()=>{
            clearTimeout(timeOut)
        })
    } , [timeOut])

    useEffect(()=>{
        if(Open) UpdateMessage()
        setOpen(true)
    } , [is_change])

    const onMessage = async () => {
        await FetchMsg(false , "start")
        SetStartMessage(true)
    }

    const UpdateMessage = async () => {
        await FetchMsg(false , "get")
        UpdateScroll("get")
        setFocusUnread("get")
    }

    const UpdateScroll = (ToUnload = FocusUnread) => {
        if(ToUnload === "start") {
            if(messageRef.current && Unread.current) messageRef.current.scrollTop = Unread.current.offsetTop - 5
            else if (messageRef.current) messageRef.current.scrollTop = ScrollRef.current.clientHeight
        }
        else if(ToUnload === "get") {
            const NodeInScrollLast = ScrollRef.current.childNodes.item(ScrollRef.current.childNodes.length - 1 )
            if(NodeInScrollLast) 
                if(NodeInScrollLast.offsetTop - messageRef.current.scrollTop <= messageRef.current.clientHeight) {
                    settimeOut(setTimeout(()=>{
                        messageRef.current.scrollTop = ScrollRef.current.clientHeight
                    } , 200))
                }
        }
            
    }

    const FetchMsg = async ( limit , open) => {
        setLoadMsg(false)
        const data = open === "start" ?
                        {
                            uid_line : Data.uid_line,
                            open_msg : open
                        } :
                    open === "get" ?
                        {
                            uid_line : Data.uid_line,
                            id_start : message[message.length - 1] ? message[message.length - 1].id : 0,
                            open_msg : open
                        } :
                    open === "load" ?
                        {
                            uid_line : Data.uid_line,
                            limit : limit,
                            id_start : message[0] ? message[0].id : 0,
                            open_msg : open
                        } : {}
        const list_msg = await clientMo.post('/api/doctor/farmer/msg/get' , data)
        if(list_msg) {
            const DataFetch = JSON.parse(list_msg)
            let Body = []
            let Read = false
            if(open === "start") {
                SetMessage(DataFetch)
                Body = DataFetch
                Read = true
            } else if(open === "get") {
                SetMessage((prevent)=>[ ...prevent , ...DataFetch]);
                Body = [...message , ...DataFetch]
                Read = true
            } else if(open === "load") {
                SetMessage((prevent)=>[...DataFetch , ...prevent])
                Body = [...DataFetch , ...message]
            }

            setLoadMsg(true)
            if(Read) 
                clientMo.post("/api/doctor/farmer/msg/read" , {
                    uid_line : Data.uid_line
                })
        } else session()
    }

    const LoadMessageOld = (e) => {
        if(e.target.scrollTop <= 80 && getLoadMsg) {
            FetchMsg(5 , "load")
            setFocusUnread("load")
        }
    }

    const OnChangeRow = (e = document.getElementById()) => {
        e.target.removeAttribute("style")
        e.target.style.height = `${e.target.scrollHeight}px`
        setSize_input(e.target.clientHeight)
    }

    const CheckSend = () => {
        if(TextSend.current.value) {
            setBtSend(true)
            return {
                textSend : TextSend.current.value,
                uid_line : Data.uid_line
            }
        } else setBtSend(false)
    }

    const SendMsg = async () => {
        const Data = CheckSend()
        if(Data) {
            setBtSend(false)
            TextSend.current.value = ""
            TextSend.current.removeAttribute("style")
            const result = await clientMo.post("/api/doctor/farmer/msg/send" , Data)
            if(result === "line error") alert("ระบบการส่งข้อความมีปัญหาด้านข้อจำกัด กรุณารอส่งข้อความในเดือนถัดไป")
        }
    }

    return(
        <section className="message-reply" style={{
            '--size_box_input' : `${Size_input}px`
        }}>
            <div className="message" ref={messageRef} onScroll={LoadMessageOld}>
                <div className="scroll-msg" ref={ScrollRef} onLoad={()=>UpdateScroll()} style={{
                    height : Startmessage ? "auto" : "100%"
                }}>
                {Startmessage ?
                    message.map((val)=>{
                        return(
                            val.type_message !== "unread" ?
                            <div key={parseInt(val.id)} className="user-other" is_me={val.is_me ? "" : null}>
                                { !val.is_me ? 
                                    <div className="img">
                                        <img src={val.img_doctor ?? Data.img}></img>
                                    </div> : <></>
                                }
                                <div className="message-detail">
                                    { !val.is_me ?
                                        <div className="name">
                                            {val.type == "" ? "เกษตรกร" : `หมอพืช ${val.name_doctor}`}
                                        </div> : <></>
                                    }
                                    <div className={`message-box ${!val.is_me ? val.type ? "doctor-other" : "" : ""} ${val.type_message === "text" || val.type_message === "location" ? "" : "file"}`}>
                                        <DetailMessange Msg={val} Ref={RefOpenImg} setOpen={setImageShow}/>
                                    </div>
                                </div>
                            </div> :
                            <div key={0} ref={Unread} className="unread">ยังไม่ได้อ่าน</div>
                        )
                    })
                    :
                    <div style={{
                        width : "100%",
                        height : "100%",
                        display : "flex",
                        justifyContent : "center",
                        alignItems : "center"
                    }}>
                        <Loading size={50} border={8} color="white" animetion={true}/>
                    </div>
                }
                </div>
            </div>
            <div className="send-msg">
                <div className="input-send">
                    <textarea ref={TextSend} onInput={(e)=>{
                        OnChangeRow(e)
                        CheckSend()
                    }} wrap="soft"></textarea>
                </div>
                <a title="ส่ง" onClick={SendMsg} sendoff={BtSend ? null : ""}>
                    <svg viewBox="0 0 24 24">
                        <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
            </div>
            <PopupDom Ref={RefOpenImg} Body={getImageShow} zIndex={999} Background="#000000b3"/>
            {/* <div className="bt-send">
                
            </div> */}
        </section>
    )
} 

const DetailMessange = ({Msg , Ref , setOpen}) => {
    const [FileData , setFileData] = useState("") 
    const Textarea = useRef()

    useEffect(()=>{
        FetchContentMsg()
        // Textarea.current.style.height = Textarea.current.scrollHeight + "px";
    } , [])

    const FetchContentMsg = async () => {
        if(Msg.type_message == "image") {
            const url = `https://api-data.line.me/v2/bot/message/${Msg.message}/content`
            try {
                const Data = await fetch(url , {
                    method : "GET",
                    headers : {
                        Authorization : "Bearer 3bRyKhlM01xFG6hDC+x5ZlfT0r44XF4L5wHORR9CJc87tmjrHoQJad6kLvOa8cbX7hSHVu6SB08UcWx2I9QjdNWRLo6fwsExPTbm7Wuaw7Eq6zh6DJXs9FFQqSbXxZKvHJt4jURZqu4Z0NcP6zJ4wwdB04t89/1O/w1cDnyilFU="
                    }
                }).then(data=>data.blob())
                const imageUrl = URL.createObjectURL(Data);  // แปลง binary เป็น Blob object
                setFileData(imageUrl)
            } catch(e) {
                setFileData("not-image")
            }
        }
    }

    const OpenImage = (srcImage) => {
        setOpen(<OpenImageMax img={srcImage} Ref={Ref} setPopup={setOpen}/>)
    }

    return (
        Msg.type_message == "text" ? <div className="msg">{Msg.message}</div> : 
        Msg.type_message == "location" ? <div className="msg">{`ตำแหน่ง ${Msg.message}`}</div> :
        FileData ? 
            Msg.type_message == "image" ? <img onClick={()=> FileData ? OpenImage(FileData) : null} src={FileData != "not-image" ? FileData : "/no image.png"}></img> : 
            "" 
        : 
        <div style={{
            padding : "4px 3px"
        }}>
            <Loading size={20} border={5} color="#aff7ea" animetion={true}/>
        </div>
    )
}

export default Messageing