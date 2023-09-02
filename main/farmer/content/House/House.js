import React, { useEffect , useRef , useState } from "react";
import { clientMo } from "../../../../src/assets/js/moduleClient";
import { Loading , MapsJSX, ReportAction, ResizeImg } from "../../../../src/assets/js/module";

import "./assets/House.scss"
import { CloseAccount } from "../../method";

const House = ({Ref , setPopup , id_farmhouse , setPage}) => {

    const [getOldData , setOldData] = useState([])

    const ImageCurrent = useRef()
    const [PreviewImage , setPreview] = useState("")
    const ControlImage = useRef()
    const Frame = useRef()
    const LoadingEle = useRef()
    const CropImg = useRef()
    const namefarm = useRef()
    const LoadingPreview = useRef()
    const bodySection = useRef()

    const [PositionMouse,setPosition] = useState(0)
    const [PoX,setX] = useState(0)
    const [PoY,setY] = useState(0)
    const [xM,setXM] = useState(0)
    const [yM,setYM] = useState(0)
    const [CurrentP,setCurrentP] = useState({
        x : 0,
        y : 0
    })

    const [LoadingImg , setLoading] = useState(false) 

    const [sizeWidthImg , setWidthImg] = useState(0)
    const [sizeHeightImg , setHeightImg] = useState(0)

    const [Textdata , setText] = useState("")
    const [OpenPop , setOpen] = useState(0)
    const [ResultPop , setResult] = useState(0)

    const frameLate = 1

    useEffect(()=>{
        bodySection.current.style.width = `${window.innerWidth}px`
        bodySection.current.style.height = `${window.innerHeight}px`

        Frame.current.style.width = `${window.innerWidth * 0.8}px`
        Frame.current.style.height = `${window.innerWidth * 0.8}px`
        LoadingEle.current.style.width = `${window.innerWidth * 0.8}px`
        LoadingEle.current.style.height = `${window.innerWidth * 0.8}px`
        
        ImageCurrent.current.style.transform = `translate(${CurrentP.x}px , ${CurrentP.y}px)`

        FetchData()
        Ref.current.style.opacity = "1"
        Ref.current.style.visibility = "visible"
    } , [])

    const FetchData = async () => {
        const result = await clientMo.get(`/api/farmer/farmhouse/get/detail?id_farmhouse=${id_farmhouse}`)
        if(await CloseAccount(result , setPage)) {
            const Data = JSON.parse(result)
            setOldData(Data[0])
            setLag(Data[0].location ? Data[0].location.x : 0)
            setLng(Data[0].location ? Data[0].location.y : 0)
            setPreview(Data[0].img_house)
            setPosition(0)
            setX(0)
            setY(0)
            setXM(0)
            setYM(0)
            setCurrentP({
                x : 0,
                y : 0
            })
            ImageCurrent.current.removeAttribute("style")
        }
    }

    const close = () => {
        Ref.current.style.opacity = "0"
        Ref.current.style.visibility = "hidden"
        setTimeout(()=>{
            setPopup(<></>)
        } , 500)
    }

    const InputImage = (e) => {
        const file = e.target.files[0]
        setLoading(false)

        ImageCurrent.current.removeAttribute("style")
        ImageCurrent.current.removeAttribute("size")
        setCurrentP({
            x : 0,
            y : 0
        })
        if(file) {
            ResizeImg(file , 500).then((imageResult)=>{
                setPreview(imageResult)
            })
        } else {
            setLoading(true); 
            setPreview(getOldData.img_house)
        }
    }

    const movePicture = (e = document.getElementById("")) => {
        if(PreviewImage != getOldData.img_house) {
            const P = PositionMouse

            let x = xM + ((e.touches[0].clientX - P.x) / frameLate) // ค่าที่เลื่อนรูปบนแกน x
            let y = yM + ((e.touches[0].clientY - P.y) / frameLate) // ค่าที่เลื่อนรูปบนแกน y

            setX(x) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป
            setY(y) // set ค่า เพื่อนำไปตรวจสอบว่ามีการเลื่อนรูปเกินขอบหรือไม่ ตอนที่ปล่อยรูป

            ImageCurrent.current.style.transform = `translate(${x}px , ${y}px)` // action ตอนเลื่อน
        }

    }

    const setStartMove = (e) => {
        if(PreviewImage != getOldData.img_house) {
            let frame = Frame.current

            let oldX = e.target.offsetLeft // ระยะขอบซ้ายรูปกับระยะขอบซ้ายหน้าจอ เพื่อหาตำแหน่งของรูปบนหน้าจอ
            let oldY = e.target.offsetTop // ระยะขอบบนรูปกับระยะขอบบนหน้าจอ เพื่อหาตำแหน่งของรูปบนหน้าจอ
            
        // หาระยะห่างรูปกับกรอบ เพื่อให้ได้ค่า มากสุดที่รูปสามารถเลื่อนไปได้
            let OffsetLeft = frame.offsetLeft - oldX // ค่าหลัก ผลต่าง ขอบซ้าย
            let OffsetTop = frame.offsetTop - oldY // ค่าหลัก ผลต่าง ขอบบน

            let OffsetRight = -1 * OffsetLeft // ค่าลอง ขอบขวา
            let OffsetBottom = -1 * OffsetTop // ค่าลอง ขอบล่าง

            setXM(parseFloat(CurrentP.x)) //set ค่าตำแหน่งรูปปัจจุบัน
            setYM(parseFloat(CurrentP.y)) //set ค่าตำแหน่งรูปปัจจุบัน

            ImageCurrent.current.style.transition = `0s` // เอา action เวลาเลื่อนออก
            setPosition({
                x : e.touches[0].clientX,
                y : e.touches[0].clientY,
                xp : OffsetLeft,
                xn : OffsetRight,
                yp : OffsetTop,
                yn : OffsetBottom
            })
        }
    }

    const setCurrent = (e) => {
        if(PreviewImage != getOldData.img_house) {
            const P = PositionMouse
            let x = 0
            let y = 0
            if(P.xn < PoX && PoX < P.xp) { // เช็คว่ารูปอยู่ในขอบเขต
                x = PoX
            } else if (P.xn > PoX || PoX > P.xp) { // เช็ครูปเกินขอบเขต
                if(P.xn > PoX) { // เมื่อเกินขอบเขตด้าน ซ้าย แกน x 
                    x = P.xn
                } else { // เมื่อเกินขอบเขตด้าน ขวา แกน x 
                    x = P.xp
                }
            }

            if(P.yn < PoY && PoY < P.yp) {
                y = PoY
            } else if (P.yn > PoY || PoY > P.yp) {
                if(P.yn > PoY) { // เมื่อเกินขอบเขตด้าน ล่าง แกน x 
                    y = P.yn
                } else { // เมื่อเกินขอบเขตด้าน บน แกน x 
                    y = P.yp
                }
            }

            setCurrentP({
                x : x,
                y : y
            })
    

            ImageCurrent.current.style.transition = `0.5s`
            ImageCurrent.current.style.transform = `translate(${x}px , ${y}px)`
        }
    }

    const LoadPic = (e) => {
        setWidthImg(ImageCurrent.current.width)
        setHeightImg(ImageCurrent.current.height)
        if(ImageCurrent.current.width > ImageCurrent.current.height) {
            CropImg.current.width = ImageCurrent.current.height
            CropImg.current.height = ImageCurrent.current.height
            ImageCurrent.current.setAttribute("size" , "h")
        } else {
            CropImg.current.width = ImageCurrent.current.width
            CropImg.current.height = ImageCurrent.current.width
            ImageCurrent.current.setAttribute("size" , "w")
        }

        setLoading(true); 
    }

    const CropImageToData = () => {
        if(ImageCurrent.current.src.indexOf(getOldData.img_house) < 0) {
            const context = CropImg.current.getContext('2d')
            const FrameIn = Frame.current
            const Img = ImageCurrent.current

            const sizeImgW = parseFloat(CropImg.current.getAttribute("w"))
            const sizeImgH = parseFloat(CropImg.current.getAttribute("H"))
            const Pox = parseFloat(Img.getAttribute("pox"))
            const Poy = parseFloat(Img.getAttribute("poy"))

            const scaleW = sizeImgW / Img.width
            const scaleH = sizeImgH / Img.height

            context.drawImage(
                Img,
                ((FrameIn.offsetLeft - Img.offsetLeft) * scaleW) - (Pox * scaleW),
                ((FrameIn.offsetTop - Img.offsetTop) * scaleH) - (Poy * scaleH),
                sizeImgW,
                sizeImgH,
                0,
                0,
                sizeImgW,
                sizeImgH,
            )

            return CropImg.current.toDataURL('image/jpeg')
        } return getOldData.img_house
    }

    const confirmData = () => {
        setOpen(1)
        let CropImage = CropImageToData()
    
        let data = {
            img : CropImage,
            name : namefarm.current.value,
            lag : getLag,
            lng : getLng
        }

        const OldLOcation = getOldData.location ?? {
            x : 0,
            y : 0
        }

        if(data.img && data.name && data.lag && data.lng && 
            (data.img != getOldData.img_house || data.name != getOldData.name_house || data.lag != OldLOcation.x || data.lng != OldLOcation.y)) {

            if(!data.img || (data.img == getOldData.img_house)) {
                delete data.img;
            }

            if (!data.name || (data.name == getOldData.name_house)) {
                delete data.name;
            }

            if (!data.lag || !data.lng || (data.lag == OldLOcation.x || data.lng == OldLOcation.y)) {
                delete data.lag;
                delete data.lng;
            }

            data.id_farmhouse = id_farmhouse
            clientMo.postForm("/api/farmer/farmhouse/edit" , data).then( async (result)=>{
                if(await CloseAccount(result , setPage)) {
                    setText("แก้ไขโรงเรือนสำเร็จ")
                    setResult(1)
                }
            })
        } else {
            setText("กรุณาแก้ไขข้อมูล")
            setResult(3)
        }
    } 

    // let loadnum = true
    // const LoadOn = () => {
    //     if(loadnum) {
    //         clientMo.unLoadingPage()
    //         loadnum = false
    //     }
    // }

    const actionArert = () => {
        setOpen(0)
        FetchData()
        setTimeout(()=>{
            setText("")
            setResult(0)
        } , 500)
    }

    const [getLoadingMap , setLoadingMap] = useState(true)
    const [getLag , setLag] = useState(0)
    const [getLng , setLng] = useState(0)

    // useEffect(()=>{
    //     getGenerateMap()
    // } , [])

    const getGenerateMap = () => {
        navigator.geolocation.getCurrentPosition((location)=>{
            setLag(location.coords.latitude)
            setLng(location.coords.longitude)
        } , (err) => {
            setLag(-1)
            setLng(-1)
        } , null , {
            enableHighAccuracy: true
        })
    }

    return (
        // <section ref={bodySection} onLoad={LoadOn} className="house-detail">
        //     {/* <div className="loading-show" ref={LoadingPreview}>

        //     </div> */}
        //     {/* <PopupAlert  textData={Textdata} open={OpenPop} result={ResultPop} liff={liff}
        //         setText={setText} setOpen={setOpen} setResult={setResult}/> */}
        //     <ReportAction Open={OpenPop} Text={Textdata} Status={ResultPop}
        //                     setOpen={setOpen} setText={setText} setStatus={setResult}
        //                     sizeLoad={90} BorderLoad={10} color="green" action={actionArert}/>
        //     <div className="content">
        //         <div className="name-farmhouse">
        //             <input type="text" defaultValue={getOldData.name_house ? getOldData.name_house : ""} ref={namefarm} placeholder="ชื่อโรงเรือน"></input>
        //         </div>
        //         <div className="box-image">
        //             <div onLoad={LoadPic} ref={Frame} className="frame-picture">
        //                 {(LoadingImg) ? 
        //                     <div ref={LoadingEle}></div>
        //                     :
        //                     <div ref={LoadingEle} className="Loading-img">
        //                         <Loading size={70} border={8} color="green" animetion={true}/>
        //                     </div>
        //                 }
        //                 <img pox={CurrentP.x} poy={CurrentP.y} onTouchEnd={setCurrent} onTouchStart={setStartMove} onTouchMove={movePicture} ref={ImageCurrent} src={PreviewImage}></img>
        //             </div>
        //             <div className="content-bt">
        //                 <div onClick={()=>ControlImage.current.click()} className="bt-upload">อัปโหลดรูปภาพ</div>
        //             </div>
        //         </div>
        //         <div className="generate-map">
        //             <span>ตำแหน่งโรงเรือน</span>
        //             <div className="frame-map">
        //                 { getLoadingMap ?
        //                     <div className="frame-background-loading-map">
        //                         <div className="loading-map-house">
        //                             <Loading size={"100%"} border={"4vw"} animetion={true}/>
        //                         </div>
        //                     </div>
        //                     : <></>
        //                 }
        //                 <div className="map-house">
        //                     <MapsJSX lat={getLag} lng={getLng} w={"100%"} h={"100%"}/>
        //                 </div>
        //                 <div className="reload-map" onClick={()=>{
        //                     setLag(0)
        //                     setLng(0)
        //                     setLoadingMap(true)

        //                     setTimeout(()=>{
        //                         getGenerateMap()
        //                     } , 500)
        //                 }}>โหลดตำแหน่ง</div>
        //             </div>
        //         </div>
        //     </div>
        //     <div className="content-bt">
        //         <button onClick={close} className="bt-cancel">ยกเลิก</button>
        //         <button onClick={confirmData} className="bt-submit">บันทึก</button>
        //     </div>
        //     <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input>
        //     <canvas w={sizeWidthImg} h={sizeHeightImg} hidden ref={CropImg}></canvas>
        // </section>
        <section ref={bodySection} onLoad={clientMo.unLoadingPage} className="house-detail">
            <div className="content-max-width">
                <div className="title">เพิ่มโรงเรือน</div>
                <div className="frame-house-detail">
                    <div className="frame-content-house">
                        <div className="content">
                            <div className="name-farmhouse">
                                <span>ชื่อโรงเรือน</span>
                                <input type="text" defaultValue={getOldData.name_house ? getOldData.name_house : ""} ref={namefarm} placeholder="แนะนำ 12 ตัวอักษร" onInput={(e)=>{
                                    e.target.value = e.target.value.slice(0 , 45)
                                }}></input>
                            </div>
                            <div className="box-image">
                                <div onLoad={LoadPic} ref={Frame} className="frame-picture">
                                    {(LoadingImg) ? 
                                        <div ref={LoadingEle}></div>
                                        :
                                        <div ref={LoadingEle} className="Loading-img">
                                            <Loading size={70} border={8} color="green" animetion={true}/>
                                        </div>
                                    }
                                    <img pox={CurrentP.x} poy={CurrentP.y} onTouchEnd={setCurrent} onTouchStart={setStartMove} onTouchMove={movePicture} ref={ImageCurrent} src={PreviewImage}></img>
                                </div>
                                <div className="content-bt-image">
                                    <div onClick={()=>ControlImage.current.click()} className="bt-upload">อัปโหลดรูปภาพ</div>
                                </div>
                                <input ref={ControlImage} hidden type="file"  accept="image/*" capture="user" onInput={InputImage} ></input>
                                <canvas w={sizeWidthImg} h={sizeHeightImg} hidden ref={CropImg}></canvas>
                            </div>
                            <div className="generate-map">
                                <span>ตำแหน่งโรงเรือน</span>
                                <div className="frame-map">
                                    { getLoadingMap ?
                                        <div className="frame-background-loading-map">
                                            <div className="loading-map-house">
                                                <Loading size={"100%"} border={"4vw"} animetion={true}/>
                                            </div>
                                        </div>
                                        : <></>
                                    }
                                    <div className="map-house" onLoad={()=>setLoadingMap(false)}>
                                        <MapsJSX lat={getLag} lng={getLng} w={"100%"} h={"100%"}/>
                                    </div>
                                    <div className="reload-map" onClick={()=>{
                                        setLag(0)
                                        setLng(0)
                                        setLoadingMap(true)

                                        setTimeout(()=>{
                                            getGenerateMap()
                                        } , 500)
                                    }}>โหลดตำแหน่ง</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-bt">
                    <button onClick={close} className="bt cancel">ยกเลิก</button>
                    <button onClick={confirmData} className="bt submit">บันทึก</button>
                </div>
            </div>
            <ReportAction Open={OpenPop} Text={Textdata} Status={ResultPop}
                setOpen={setOpen} setText={setText} setStatus={setResult}
                sizeLoad={90} BorderLoad={10} color="green" action={actionArert}/>
        </section>
    )
}

// const HouseEdit = ({Ref , setPopup , id_farmhouse , setPage}) => {
//     useEffect(()=>{
//         Ref.current.style.opacity = "1"
//         Ref.current.style.visibility = "visible"
//     } , [])

//     const FetchData =async () => {
//         const result = await clientMo.get(`/api/farmer/farmhouse/get/detail?id_farmhouse=${id_farmhouse}`)
//         if(await CloseAccount(result , setPage)) {
            
//         }
//     }

//     const close = () => {
//         Ref.current.style.opacity = "0"
//         Ref.current.style.visibility = "hidden"
//         setTimeout(()=>{
//             setPopup(<></>)
//         } , 500)
//     }
// }

export default House