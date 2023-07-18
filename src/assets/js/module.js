import React, { useEffect, useRef, useState } from "react";
import liff from "@line/liff"

const MapsJSX = ({lat , lng , w , h}) => {
    const [latitude , setLag] = useState(0)
    const [longtitude , setLng] = useState(0)

    useEffect(()=>{
        setLag(lat)
        setLng(lng)
    } , [lat , lng])
    return(
        <iframe src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_API_KEY}&q=${latitude},${longtitude}&zoom=18&maptype=satellite`} 
           frameBorder={0} width={w} height={h} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    )
}

const DayJSX = ({REF , DATE , TYPE = "full" , TEXT = ""}) => {
    const [DateOut , setDATE] = useState("")
    const DayWeek = [ 'วันอาทิตย์','วันจันทร์','วันอังคาร','วันพุธ','วันพฤหัสบดี','วันศุกร์','วันเสาร์'] 
    const Mount = [ "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"] 

    useEffect(()=>{
        const DateIn = new Date(DATE)
        if(TYPE === "full") setDATE(`${DayWeek[DateIn.getDay()]} ที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ปี พ.ศ. ${DateIn.getFullYear() + 543}`)
        else if (TYPE === "small") setDATE(`${TEXT ? `${TEXT} ` : ""}${DateIn.getUTCDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
        else setDATE(`วันที่ ${DateIn.getDate()} ${Mount[DateIn.getMonth()]} ${DateIn.getFullYear() + 543}`)
    })

    return (<input date_dom="" ref={REF} readOnly value={DateOut}></input>)
}

const TimeJSX = ({DATE , MAX = true}) => {
    const [Time , setTime] = useState("")

    useEffect(()=>{
        const TimeIn = new Date(DATE)
        if(MAX) setTime(`เวลา ${TimeIn.getUTCHours()} นาฬิกา ${TimeIn.getMinutes()} นาที ${TimeIn.getSeconds()} วินาที`)
        else setTime(`เวลา ${TimeIn.getUTCHours()}:${TimeIn.getMinutes() >= 10 ? TimeIn.getMinutes() : `0${TimeIn.getMinutes()}`}`)
    })

    return(<input readOnly value={Time}></input>)
}

const ClosePopUp = (e , id , stateChange , back=false) => {
    if(e.target.id === id) {
        document.getElementById(id).removeAttribute('show')
        stateChange()
    }

    if(e.target.id === id && back) {
        window.history.back()
    }
}

const Socket = (eventSc , message) => {
    const socket = new WebSocket(`ws://${window.location.href}:3000`);
}

const useLiff = (idLiff) => {
    const Liff = liff
    const init = Liff.init({liffId:idLiff})
    return [init , Liff];
}

import "../style/camera.scss"
const Camera = (props) => { // ยังไม่เสร็จ
    const [StatusCamera , setStatus] = useState(false)
    const [BodyCamera , setBody] = useState(<></>)
    const ContentCamera = useRef()

    useEffect(()=>{
        props.control.current.addEventListener('click' , CameraOnOff)
        console.log(props.img)
        return () => {
            props.control.current.removeEventListener('click' , CameraOnOff)
        }
    } , [])

    const CameraOnOff = () => {
        if(!StatusCamera) {
            ContentCamera.current.setAttribute("show" , "")
            setBody(<CameraOpen/>)
            setStatus(true)
        } else {
            ContentCamera.current.removeAttribute("show")
            setBody(<></>)
            setStatus(false)
        }
    }

    const CameraOpen = () => {
        const PreviewCamera = useRef()
        let Stream = null
        const ObNavigor = navigator.mediaDevices

        useEffect(()=>{
            OpenCamera()
            return () => {
                StopCamera()
            }
        })

        const OpenCamera = () => {
            ObNavigor.getUserMedia({
                video:{
                    width:{ideal: 260 },
                    height: {ideal: 260}
                },
                audio:false
            }).then((stream)=>{
                Stream = stream //set stream video
                PreviewCamera.current.srcObject = Stream //add Object stream
                stream = null //set stream off
            }).catch((err)=>{
                alert(err)
            })
        }

        const StopCamera = () => {
            if(Stream) {
                Stream.getTracks().forEach(track => {
                    track.stop();
                })
                Stream = null
            }
        }

        return(
            <section className="frame-camera">
                <canvas id="result-camera-capture"></canvas>
                <video ref={PreviewCamera} autoPlay></video>
            </section>
        )
    }

    return(
        <div ref={ContentCamera} className="content-camera" onClick={CameraOnOff}>
            {BodyCamera}
            <button>CAPTURE</button>
        </div>
    )
}

const ResizeImg = (file , MaxSize) => {
    return new Promise((resole , reject)=>{
        const image = new Image();

        image.onload = function () {
            let width = image.width;
            let height = image.height;
            
            if(width > MaxSize || height > MaxSize) {
                if(width < height) {
                    height = (MaxSize / width) * height;
                    width = MaxSize;
                } else if(width > height) {
                    width = (MaxSize / height) * width
                    height = MaxSize
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            // ctx.imageSmoothingEnabled = false
            // ctx.imageSmoothingQuality = true
            ctx.drawImage(image, 0, 0, width, height);

            resole(canvas.toDataURL('image/jpeg'))
        };

        image.src = URL.createObjectURL(file);
    })
}

const Loading = ({size , border , color="green" , animetion = false}) => {
    return (
        <div style={{
            width : isNaN(size) ? size : `${size}px`,
            height : isNaN(size) ? size : `${size}px`,
            overflow : "hidden"
        }}>
            <div className="curcle"
                style={{
                    border: `${isNaN(border) ? border : `${border}px`} solid ${color}`,
                    borderLeft : `${isNaN(border) ? border : `${border}px`} solid transparent`,
                    borderRadius : "50%",
                    width : "100%",
                    height : "100%",
                    animation : animetion ? "rotate-curcle 2s cubic-bezier(0, 0, 0, 0) 0s infinite" : "none"
                }}
            ></div>
        </div>
    )
}

import * as FileSaver from "file-saver"
import XLSX from "sheetjs-style"

const ExportExcel = ({ excelData , fileName , nameBT}) => {
    const filetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = ".xlsx"

    const exportToExcel = async () => {
        const DataExport = new Map()
        const NameSheet = new Array()
        for(let key in excelData){
            let ws = XLSX.utils.json_to_sheet(excelData[key])
            NameSheet.push(key)
            DataExport.set(key , ws)
        }

        const JsonExport = Object.fromEntries(Array.from(DataExport));
        const wb = {Sheets : JsonExport , SheetNames : NameSheet}
        const excelBuffer = XLSX.write(wb , {bookType : "xlsx" , type : "array"})

        
        const data = new Blob([excelBuffer] , {type : filetype})
        FileSaver.saveAs(data , fileName , fileExtension)
    }

    return (
        <button onClick={(e)=>exportToExcel(fileName)}>{nameBT}</button>
    )
}

import {Document,Page,Text,View,StyleSheet,PDFViewer,PDFDownloadLink} from "@react-pdf/renderer";
import {jsPDF} from 'jspdf'
// import autoTable from 'jspdf-autotable';
const TextBoxDot = (pdf , count , xStart , y , textOnDot) => {
    let posi = parseInt(xStart);
    for(let x = 1; x <= parseInt(count);x++) {
        let gidx = posi - 1
        let gidy = parseInt(y) + 1
        pdf.circle( gidx , gidy , 0.7 , 'F');
        posi += 4
    }
    const widthText = pdf.getStringUnitWidth(textOnDot) * 18
    pdf.text(textOnDot , xStart + ((posi - 3 - xStart) / 2) - widthText / 2 , parseInt(y) - 1)
    return posi - 3
}

const TableBox = (pdf = new jsPDF() , posiStartX = 0 , posiStartY = 0 , headers = {} , body = {} , heightHeader = 0 , heightBody = 0 , FontSize = 0) => {

    pdf.setFontSize(FontSize)
    let startHeadX = posiStartX
    let startHeadY = posiStartY
    const ObjectText = {
        fontSize: FontSize,
        fontName: "THSarabunNew",
    }

    for(let headerData of headers) {
        const widthText = pdf.getStringUnitWidth(headerData.name) * FontSize
        const lineHeight = pdf.getTextDimensions(headerData.name, ObjectText).h;
        const endX = startHeadX + parseInt(headerData.size)
        const endY = startHeadY + heightHeader

        pdf.line(startHeadX , startHeadY , endX , startHeadY) //line ขอบบน
        if(body.length === 0) pdf.line(startHeadX , endY , endX , endY) //line ขอบล่าง header
        // pdf.line(startHeadX , endY , endX , endY) //line ขอบล่าง
        pdf.line(startHeadX , startHeadY , startHeadX , endY) //line แบ่งช่องแนวตั้ง
        pdf.text(headerData.name , startHeadX + ((endX - startHeadX) / 2) - widthText / 2 , startHeadY + ((endY - startHeadY) / ((headerData.headSup) ? (headerData.headSup.length + 1) : 1)/2) + (lineHeight / 3.5))
        if(headerData.headSup) {
            const findCenter = startHeadY + ((endY - startHeadY) / (headerData.headSup.length + 1))
            const findXCenter = startHeadX + ((endX - startHeadX) / (headerData.headSup.length + 1))
            pdf.line(startHeadX , findCenter , endX , findCenter)
            pdf.line(findXCenter , findCenter , findXCenter , findCenter + heightHeader / (headerData.headSup.length + 1))
            
            let startSubX = startHeadX
            let endSubX = findXCenter
            for(let row of headerData.headSup) {
                for(let data of row) {
                    const widthTextSub = pdf.getStringUnitWidth(data.name) * FontSize
                    const lineHeightSub = pdf.getTextDimensions(data.name, ObjectText).h;
                    pdf.text(data.name , startSubX + ((endSubX - startSubX) / 2) - widthTextSub / 2, findCenter + heightHeader / (headerData.headSup.length + 1) - (lineHeightSub / 3.5))
                    let newPosi = endSubX - startSubX
                    startSubX += newPosi
                    endSubX += newPosi
                }
            }

        }
        startHeadX += parseInt(headerData.size)
    }
    pdf.line(startHeadX , startHeadY , startHeadX , startHeadY + heightHeader)
    
    let startBodyY = startHeadY + heightHeader
    for(let Row of body) {
        let startBodyX = posiStartX
        for(let Body of Row) {
            const widthText = pdf.getStringUnitWidth(Body.name) * FontSize
            const lineHeight = pdf.getTextDimensions(Body.name, ObjectText).h;
            const endX = startBodyX + parseInt(Body.size)
            const endY = startBodyY + heightBody
    
            pdf.line(startBodyX , startBodyY , endX , startBodyY) //line ขอบบน
            pdf.line(startBodyX , endY , endX , endY) //line ขอบล่าง
            pdf.line(startBodyX , startBodyY , startBodyX , endY) //line แบ่งช่องแนวตั้ง
            pdf.text(Body.name , startBodyX + ((endX - startBodyX) / 2) - widthText / 2 , startBodyY + ((endY - startBodyY) / 2) + (lineHeight / 3.5))
            startBodyX += parseInt(Body.size)
        }
        pdf.line(startBodyX , startBodyY , startBodyX , startBodyY + heightBody)
        startBodyY += heightBody
    }

    pdf.setFontSize(16)
    return(startBodyY)
}

const TextBoxSplit = (pdf = new jsPDF() , qtyStartTextOnRow , qtyNormalTextOnRow , HeadText , fontSizeHead , fontSizeBody , startRow , startColumn , TextInput) => {
    const Text = TextInput.split("|")

    let qtyText = 0
    let qtyMaxTextonRow = qtyStartTextOnRow // จำนวนตัวอักษรมากสุดในแถว 15
    let RowText = 1

    let newTextRow = new Array //ประโยคที่แบ่งแถวแล้ว
    let keyNewText = 0
    let keyPre = 0

    // หาจำนวนแถว และแบ่งประโยคเป็นแต่ละแถว
    for(const [key , val] of Object.entries(Text)) {
        newTextRow[keyNewText] = Text.slice(keyPre , parseInt(key) + 1)
        if(qtyText + val.length >= qtyMaxTextonRow) {
            keyNewText += 1
            keyPre = parseInt(key) + 1
        }
        
        qtyText += val.length

        if(qtyText >= qtyMaxTextonRow) {
            qtyText = 0
            qtyMaxTextonRow = qtyNormalTextOnRow //40
            RowText += 1
        }
    }

    // การใส่บรรทัด และเขียนตัวอักษร ในแต่ละบรรทัด
    for(let x = 0; x < RowText ;x++) {
        if(x === 0) {
            const startRowFirst = pdf.getStringUnitWidth(HeadText) * fontSizeHead + startColumn //138
            pdf.setFontSize(16)
            pdf.text( newTextRow[x] ? newTextRow[x].join("") : "" , startRowFirst + 6 , startRow - 1);
            pdf.setFontSize(16)
            TextBoxDot(pdf , pdf.getStringUnitWidth(newTextRow[x].join("")) * fontSizeBody / 3.2 , startRowFirst + 6 , startRow , "")
        }
        else {
            const startRowFirst = startColumn //50
            pdf.setFontSize(16)
            pdf.text( newTextRow[x] ? newTextRow[x].join("") : "" , startRowFirst , startRow - 1);
            pdf.setFontSize(16)
            TextBoxDot(pdf , pdf.getStringUnitWidth(newTextRow[x].join("")) * fontSizeBody / 3.2 , startRowFirst , startRow , "")
        }
        startRow += 22
    }
    startRow += 8
    return startRow

    // วัดข้อความตามขอบเขตก่อน แล้วแบ่งเป็น array ตามขอบเขต โดยขอบเขตอยู่กลางคำใด จะตัดคำนั้นไปบรรทัดใหม่
}

const TextBoxHead = (pdf = new jsPDF() , x , y , text , style = {}) => {
    pdf.setFont('THSarabunNew-bold' , "bold");
    pdf.text(text , x , y , style)
    pdf.setFont('THSarabunNew' , "normal");
}
 
const ExportPDF = async (Data) => {
    const pdf = new jsPDF("portrait", "pt", "a4" , {
        compress: false
    });
    
    pdf.addFileToVFS("/THSarabunNew.ttf");
    pdf.addFont('/THSarabunNew.ttf', 'THSarabunNew', 'normal');
    pdf.addFont('/THSarabunNewBold.ttf', 'THSarabunNew-bold', 'bold');
    pdf.setFont('THSarabunNew'); // set font

    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();

    for(let index in Data){

        // ระยะบรรทัด 30 
        // ย่อหน้า 70
        const Export = Data[index]
        console.log(Export)
        pdf.setFontSize(18)
        TextBoxHead(pdf , width / 2 , 40 , 'แบบบันทึกเกษตรกร ระบบการผลิตพืชผักและสมุนไพรภายใต้มาตรฐาน  GAP  มูลนิธิโครงการหลวง' , {align : "center"})
        
        pdf.setFontSize(16)
        TextBoxHead(pdf , width/2/3 + 30 , 70 , Export.dataForm.type_main)
        TextBoxHead(pdf , width/2 - 70 , 70 , "รหัสเกษตรกร")

        let startId = width/2
        let newX = 0
        let positionDot = 0
        for(let x = 0; x < 10 ; x++) {
            pdf.rect(startId , 57 , 20 , 20 , "S");
            (Export.farmer[0].id_farmer[x]) ? pdf.text(Export.farmer[0].id_farmer[x] , startId + 7 , 70 ) : null;
            if(x === 7) {
                startId += 28;
                pdf.text("_" , startId - 7 , 65 )
            }
            else startId += 22;
        }
        
        
        TextBoxHead(pdf , 30 , 100 , '๑.')
        TextBoxHead(pdf , 50 , 100 , 'ชื่อ/สกุล เกษตรกร')
        newX = TextBoxDot(pdf , 65 , 134 , 100 , Export.farmer[0].fullname)

        TextBoxHead(pdf , newX , 100 , 'ศูนย์ฯ')
        TextBoxDot(pdf , 38 , newX + 28 , 100 , Export.farmer[0].station)

        TextBoxHead(pdf , 30 , 130 , '๒.')
        TextBoxHead(pdf , 50 , 130 , 'ชนิดพืช')
        newX = TextBoxDot(pdf , 27 , 86 , 130 , Export.dataForm.name_plant)

        TextBoxHead(pdf , newX , 130 , 'รุ่นที่ปลูก')
        newX = TextBoxDot(pdf , 16 , newX + 41 , 130 , Export.dataForm.generation.toString())

        TextBoxHead(pdf , newX , 130 , 'วันที่เพาะกล้า')
        const DateGlow = Export.dataForm.date_glow.split("-")
        newX = TextBoxDot(pdf , 22 , newX + 62 , 130 , `${DateGlow[2].split(" ")[0]}/${DateGlow[1]}/${parseInt(DateGlow[0]) + 543}` )

        TextBoxHead(pdf , newX , 130 , 'วันที่ปลูก')
        const DatePlant = Export.dataForm.date_plant.split("-")
        TextBoxDot(pdf , 22 , newX + 42 , 130 , `${DatePlant[2].split(" ")[0]}/${DatePlant[1]}/${parseInt(DatePlant[0]) + 543}` )


        TextBoxHead(pdf , 50 , 160 , 'ระยะการปลูก')
        newX = TextBoxDot(pdf , 22 , 112 , 160 , Export.dataForm.posi_w.toString()+"X"+Export.dataForm.posi_h.toString())

        TextBoxHead(pdf , newX , 160 , 'จำนวนต้น')
        newX = TextBoxDot(pdf , 14 , newX + 48 , 160 , Export.dataForm.qty.toString())
        
        TextBoxHead(pdf , newX , 160 , 'พื้นที่')
        newX = TextBoxDot(pdf , 17 , newX + 24 , 160 , Export.dataForm.area.toString())

        TextBoxHead(pdf , newX , 160 , 'วันที่คาดว่าจะเก็บเกี่ยว')
        const DateOut = Export.dataForm.date_harvest.split("-")
        newX = TextBoxDot(pdf , 20 , newX + 103 , 160 , `${DateOut[2].split(" ")[0]}/${DateOut[1]}/${parseInt(DateOut[0]) + 543}`)
        

        TextBoxHead(pdf , 30 , 190 , '๓.')
        TextBoxHead(pdf , 50 , 190 , 'ระบบการปลูก')
        TextBoxDot(pdf , 114 , 114 , 190 , Export.dataForm.system_glow)


        TextBoxHead(pdf , 30 , 220 , '๔.')
        TextBoxHead(pdf , 50 , 220 , 'แหล่งน้ำ')
        TextBoxDot(pdf , 120 , 90 , 220 , Export.dataForm.water)


        TextBoxHead(pdf , 30 , 250 , '๕.')
        TextBoxHead(pdf , 50 , 250 , 'วิธีการให้น้ำ')
        TextBoxDot(pdf , 116 , 105 , 250 , Export.dataForm.water_flow)


        TextBoxHead(pdf , 30 , 280 , '๖.')
        TextBoxHead(pdf , 50 , 280 , 'ประวัติการใช้พื้นที่และการเกิดโรคระบาด ชนิดพืชก่อนหน้านี้')


        TextBoxHead(pdf , 50 , 310 , 'ชนิดพืชที่ปลูก')
        newX = TextBoxDot(pdf , 30 , 114 , 310 , Export.dataForm.history)

        TextBoxHead(pdf , newX , 310 , 'โรค/แมลงที่พบ')
        newX = TextBoxDot(pdf , 34 , newX + 69 , 310 , Export.dataForm.history)

        TextBoxHead(pdf , newX , 310 , 'ปริมาณที่พบ')
        newX = TextBoxDot(pdf , 20 , newX + 58 , 310 , Export.dataForm.qtyInsect)


        TextBoxHead(pdf , 30 , 340 , '๗.')
        TextBoxHead(pdf , 50 , 340 , 'ข้อแนะนำจากที่ปรึกษา')

        let PresentRow = 365
        if(Export.report.length !== 0) {
            for(let index in Export.report) {
                TextBoxHead(pdf , 50 , PresentRow , `ครั้งที่ ${parseInt(index) + 1} คำแนะนำ`)

                PresentRow = TextBoxSplit(pdf , 15 , 40 , `ครั้งที่ ${parseInt(index) + 1} คำแนะนำ` , 16 , 14 , PresentRow , 50 , Export.report[index].report_text)
                // วัดข้อความตามขอบเขตก่อน แล้วแบ่งเป็น array ตามขอบเขต โดยขอบเขตอยู่กลางคำใด จะตัดคำนั้นไปบรรทัดใหม่
            }
        } else {
            pdf.text(`ไม่พบคำแนะนำ` , 165 , 340)
        }


        TextBoxHead(pdf , 30 , PresentRow , '๘.')
        TextBoxHead(pdf , 50 , PresentRow , 'ผลตรวจสอบแบบบันทึก ก่อนการเก็บเกี่ยวผลผลิต')
        PresentRow += 20
        TextBoxHead(pdf , 50 , PresentRow , 'จากหมอพืช')
        PresentRow += 25
        TextBoxHead(pdf , 50 , PresentRow , `ผลการตรวจสอบ`)
        TextBoxDot(pdf , 27 , 126 , PresentRow , `${Export.checkForm[0] ? Export.checkForm[0].status_check ? "ผ่าน" : "ไม่ผ่าน" : "ยังไม่ตรวจสอบ"}`)
        if(Export.checkForm.length > 0) {
            PresentRow += 25
            TextBoxHead(pdf , 50 , PresentRow , `การแก้ไข`)
            PresentRow = TextBoxSplit(pdf , 27 , 40 , "การแก้ไข" , 18 , 14 , PresentRow , 45 , Export.checkForm[0].note_text)
        } else {
            PresentRow += 30
        }
        
        TextBoxDot(pdf , 25 , 120 , PresentRow , "")
        pdf.text("(" , 92 , PresentRow + 30)
        TextBoxDot(pdf , 35 , 98 , PresentRow + 30 , Export.checkForm[0] ? Export.checkForm[0].name_doctor : "")
        pdf.text(")" , 235 , PresentRow + 30)

        TextBoxHead(pdf , 120 , PresentRow + 60 , `ลงชื่อเจ้าหน้าที่หมอพืช`)

        TextBoxHead(pdf , 92 , PresentRow + 90 , "ว/ด/ป")
        const DateCheck = Export.checkForm[0] ? Export.checkForm[0].date_check.split("T")[0].split("-") : "";
        pdf.setFontSize(15)
        TextBoxDot(pdf , 29 , 123 , PresentRow + 90 , DateCheck ? `${DateCheck[2].split(" ")[0]}/${DateCheck[1]}/${parseInt(DateCheck[0]) + 543}` : "")
        pdf.setFontSize(16)



        TextBoxHead(pdf , width / 2 - 20 , 340 , '๙.')
        TextBoxHead(pdf , width / 2 , 340 , 'ผลการวิเคราะห์สารตกค้างในผลผลิต ก่อน/หลังการเก็บเกี่ยว')

        let body = new Array
        let headers = [
            {name : "ครั้งที่", size : 30},
            {name :"วันที่วิเคราะห์" , size : 65},
            {name :"ผลวิเคราะห์" , size : 90, headSup : [ [{name : "ก่อน" , size : 45} ,{name : "หลัง" , size : 45}] ] } ,
            {name :"ผู้วิเคราะห์" , size : 70} ,
            {name : "หมายเหตุ" , size : 65}
        ]

        for(let index = 0; index < 15; index++) {
            const Data = Export.checkPlant[index]
            if(Data) {
                const DateCheck = Data.date_check.split("T")[0].split("-");
                body.push(
                    [
                        {name : (index + 1).toString() , size : 30},
                        {name : `${DateCheck[2].split(" ")[0]}/${DateCheck[1]}/${parseInt(DateCheck[0]) + 543}` , size : 65},
                        {name : !Data.state_check ? (Data.status_check).toString() : "" , size : 45} ,
                        {name : Data.state_check ? (Data.status_check).toString() : "" , size : 45} ,
                        {name : Data.name_doctor.split(" ")[0], size : 70} ,
                        {name : Data.note_text , size : 65}
                    ]
                )
            } else {
                body.push(
                    [
                        {name : (index + 1).toString() , size : 30},
                        {name : "" , size : 65},
                        {name : "" , size : 45} ,
                        {name : "" , size : 45} ,
                        {name : "", size : 70} ,
                        {name : "" , size : 65}
                    ]
                )
            }
        }

        TableBox(pdf , width / 2 - 28 , 350 , headers , body , 33 , 20 , 14)

        //page factor
        pdf.addPage()
        pdf.setFontSize(16)
        let presentFactor = 0
        let oldDay = ""
        body = new Array

        TextBoxHead(pdf , 30 , 40 , "๑๐.")
        TextBoxHead(pdf , 50 , 40 , "แบบบันทึกการใช้สารเคมีกำจัดศัตรูพืชทางการเกษตร")
        headers = [
            {name : "ว/ด/ป ที่ใช้", size : 40},
            {name :"ชื่อสิ่งที่ใช้(ชื่อการค้า)" , size : 103},
            {name :"ชื่อสามัญสารเคมี" , size : 103} ,
            {name :"ศัตรูพืชที่พบ" , size : 55} ,
            {name : "วิธีการใช้" , size : 55} , 
            {name : "อัตราที่ผสม" , size : 45} , 
            {name : "ปริมาณทั้งหมด" , size : 60} , 
            {name : "วันที่ปลอดภัย" , size : 50} , 
            {name : "แหล่งที่ซื้อ" , size : 75} , 
        ]

        for(let index in Export.chemi) {
            const Data = Export.chemi[index]
            if(Data) {
                const DateCheck = Data.date.split(" ")[0].split("-");
                const DateSafe = Data.date_safe.split(" ")[0].split("-");
                body.push(
                    [
                        {name : oldDay === DateCheck.join("") ? "" : `${DateCheck[2].split(" ")[0]}/${DateCheck[1]}/${(parseInt(DateCheck[0]) + 543).toString().slice(2 , 4)}`, size : 40},
                        {name : Data.name , size : 103},
                        {name : Data.formula_name , size : 103} ,
                        {name : Data.insect , size : 55} ,
                        {name : Data.use_is , size : 55} , 
                        {name : Data.rate , size : 45} , 
                        {name : Data.volume.toString() , size : 60} , 
                        {name : `${DateSafe[2].split(" ")[0]}/${DateSafe[1]}/${(parseInt(DateSafe[0]) + 543).toString().slice(2 , 4)}` , size : 50} , 
                        {name : Data.source , size : 75} ,
                    ]
                )
                oldDay = DateCheck.join("")
            }
        }
        
        presentFactor = TableBox(pdf , 5 , 50 , headers , body , 20 , 20 , 12) + 30
        TextBoxHead(pdf , 30 , presentFactor , "๑๑.")
        TextBoxHead(pdf , 50 , presentFactor , "แบบบันทึกการใช้ปัจจัยการผลิต (ได้แก่ ปุ๋ยเคมี ปุ๋ยหมัก ปุ๋ยคอก ปุ๋ยอินทรีย์ ปุ้ยเกร็ด และปุ๋ยน้ำหมักชีวภาพ)")
        headers = [
            {name : "ว/ด/ป ที่ใช้", size : 40},
            {name :"ชื่อสิ่งที่ใช้(ชื่อการค้า / ตรา)" , size : 135},
            {name :"ชื่อสูตรปุ๋ย" , size : 135} ,
            {name : "วิธีการใช้" , size : 90} , 
            {name : "ปริมาณที่ใช้" , size : 90} ,
            {name : "แหล่งที่ซื้อ" , size : 95} , 
        ]

        oldDay = ""
        body = new Array
        for(let index in Export.ferti) {
            const Data = Export.ferti[index]
            if(Data) {
                const DateCheck = Data.date.split(" ")[0].split("-");
                body.push(
                    [
                        {name : oldDay === DateCheck.join("") ? "" : `${DateCheck[2].split(" ")[0]}/${DateCheck[1]}/${(parseInt(DateCheck[0]) + 543).toString().slice(2 , 4)}`, size : 40},
                        {name : Data.name , size : 135},
                        {name : Data.formula_name , size : 135} ,
                        {name : Data.use_is , size : 90} , 
                        {name : Data.volume.toString() , size : 90} ,
                        {name : Data.source , size : 95} , 
                    ]
                )
                oldDay = DateCheck.join("")
            }
        }
        presentFactor = TableBox(pdf , 5 , presentFactor + 10 , headers , body , 20 , 20 , 12) + 30

        TextBoxHead(pdf , 30 , presentFactor , "ลงชื่อ")
        let farmer_name_posi = TextBoxDot(pdf , 35 , 50 , presentFactor , Export.farmer ? Export.farmer[0].fullname : "")
        TextBoxHead(pdf , farmer_name_posi , presentFactor , "เกษตรกร")

        TextBoxHead(pdf , width / 2 + 55 , presentFactor , "ลงชื่อ")
        let check_posi = TextBoxDot(pdf , 30 , width / 2 + 83 , presentFactor , "")
        TextBoxHead(pdf , check_posi , presentFactor , "ผู้ตรวจประเมิน")

        TextBoxHead(pdf , width / 2 + 40 , presentFactor + 30 , "ลงชื่อ")
        let check_boss_posi = TextBoxDot(pdf , 30 , width / 2 + 67 , presentFactor + 30, "")
        TextBoxHead(pdf , check_boss_posi , presentFactor + 30 , "หัวหน้าผู้ตรวจประเมิน")

        if(parseInt(index) + 1 !== Data.length) pdf.addPage()
    }

    // window.open(pdf.output('dataurlnewwindow' , "แบบบันทึกข้อมูล"))
    pdf.save("ทดสอบ.pdf")

    // const data = document.createElement("section");
    // data.innerHTML = 
    // `
    // 555
    // `
    // pdf.addPage().html(data)
    // pdf.html(data).then(() => {
    //     pdf.save("shipping_label.pdf");
    // });
    // return (
    //     <PDFViewer>
    //         <Document>
    //             <Page size={"A4"}>

    //             </Page>
    //             <Page size={"A4"}>

    //             </Page>
    //         </Document>
    //     </PDFViewer>
    // )
}

const ButtonMenu = ({type , textRow1 , textRow2 , action}) => {
    return(
        <div onClick={action} className={`bt-menu-frame ${type}`}>
            <img src={`/iconBt/icon-bt-${type}.png`}></img>
            <div className="text-one">{textRow1}</div>
            <div className="text-two">{textRow2}</div>
            <div className="action">
                <button>คลิก</button>
            </div>
        </div>
    )
}

const ReportAction = ({Open , Text , Status , setText , setStatus , setOpen , sizeLoad , BorderLoad , color , action = null}) => {
    const Control = useRef()

    const [state , setstate] = useState(false)

    let Time = 0

    useEffect(()=>{
        clearTimeout(Time)
        if(Open) {
            setstate(false) 
        }
    } , [Open])

    const confirm = () => {
        if(Status != 0) {
            setOpen(0)
            Time = setTimeout(()=>{
                setText("")
                setStatus(0)
            } , 500)
        }
    }

    const ShowStatus = () => {
        setstate(true)
    }
    return (
        <Report-Dom ref={Control} style={{
            display: "flex" ,
            justifyContent : "center",
            alignItems:"center",
            flexDirection : "column" ,
            zIndex : Open ? "15" : -10 ,
            width : "100%",
            height : "100%",
            position : "absolute" ,
            backgroundColor : "transparent" ,
            backdropFilter : "blur(8px)" ,
            opacity : Open ? "1" : "0" ,
            visibility : Open ? "visible" : "hidden",
            transition : "0.5s opacity , 0.5s visibility , 0.5s z-index"
        }}>
            <Body-Report style={{
                display: "flex" ,
                justifyContent : "center",
                alignItems:"center",
                flexDirection : "column" ,
                backgroundColor: "transparent",
                // boxShadow : "0px 0px 15px green",
            }}>
                <Text-Report>
                    {Text ? state ? Text : "กำลังตรวจสอบ" : "กำลังตรวจสอบ"}
                </Text-Report>
                <Status-Report style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems:"center",
                }} onLoad={ShowStatus}>
                    {
                        Status ? 
                            (Status == 1) ? 
                                <img style={{
                                    position : "absolute",
                                    opacity : state ? 1 : "0",
                                    width : sizeLoad ,
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility",
                                    backgroundColor : "transparent",
                                    backdropFilter : "blur(8px)",
                                    borderRadius : "50%"
                                }} src="/correct-icon-green.svg"></img> 
                                :
                                <img style={{
                                    position : "absolute",
                                    width : sizeLoad ,
                                    opacity : state ? 1 : "0",
                                    visibility : state ? "visible" : "hidden",
                                    transition : "0.5s opacity , 0.5s visibility"
                                }} src="/error-cross-svgrepo-com.svg"></img>
                        : <></>
                    }
                    <div style={{
                        opacity : !state ? 1 : "0",
                        visibility : !state ? "visible" : "hidden",
                        transition : "0.5s opacity , 0.5s visibility"
                    }}>
                        <Loading size={sizeLoad} border={BorderLoad} color={color} animetion={Open}/>
                    </div>
                </Status-Report>
                <BoxButton-Report>
                    <button
                        style={{
                            border : "0",
                            opacity : (Status == 0) ? 0 : 1,
                            visibility : (Status == 0) ? "hidden" : "visible",
                            transition : "0.5s opacity , 0.5s visibility"
                        }}
                        onClick={action ?? confirm}>ตกลง</button>
                </BoxButton-Report>
            </Body-Report>
        </Report-Dom>
    )
}

const PopupDom = ({Ref , Body , zIndex}) => {
    return (
        <section ref={Ref} style={{
            display : "flex",
            justifyContent : "center" ,
            alignItems : "center" ,
            backgroundColor : "transparent" ,
            backdropFilter : "blur(8px)",
            position : "fixed" ,
            width : "100%",
            height : "100%",
            top : "0" ,
            left : "0" ,
            zIndex : zIndex ,
            opacity : "0" ,
            visibility : "hidden" ,
            transition : "0.5s opacity , 0.5s visibility"
        }}>
            {Body}
        </section>
    )
}

const LoadOtherDom = ({Fetch , count , setCount , Limit , style = {
    backgroundColor : "",
    fontSize : "18px",
    sizeLoading : "31.2px",
}}) => {
    const [Load , setLoad] = useState(true)
    const Other = async () => {
        const newCount = count + Limit
        setLoad(false)
        if((await Fetch(newCount)).length === newCount) setCount(newCount)
        setLoad(true)
    }

    return (
        <div style={{
            display : "flex",
            justifyContent : "center",
            alignItems : "center",
            width : "100%",
            marginTop : "5px"
        }}>
            {Load ? 
                <button style={{
                    backgroundColor : style.backgroundColor,
                    outline : 0,
                    border : 0,
                    borderRadius : "15px",
                    color : "white",
                    fontFamily : "Sans-font",
                    fontWeight : "900",
                    fontSize : style.fontSize ? style.fontSize : "18px",
                    padding : "2px 15px"
                }} onClick={Other}>โหลดเพิ่มเติม</button>
                : <Loading size={style.sizeLoading ? style.sizeLoading : "31.2px"} border={7} color={style.backgroundColor} animetion={true}/>

            }
        </div>
    )
}

class TabLoad {
    constructor(Ref) {
        this.timeOut = new Array();
        this.TabRef = Ref
    }

    start() {
        this.timeOut.forEach(val=>{
            clearTimeout(val)
        })

        const num = Math.random()
        this.TabRef.current.removeAttribute("style")
        this.TabRef.current.style.display = `flex`
        this.TabRef.current.style.width = `${20 + (num * 40)}%`
    }

    end() {
        this.TabRef.current.style.width = `100%`
        return setTimeout(()=>{
            this.TabRef.current.removeAttribute("style")
            this.TabRef.current.style.display = `none`
        } , 500)
    }

    addTimeOut(id) {
        this.timeOut.push(id)
    }

    getTime() {
        return this.timeOut
    }
}

class HrefData {
    constructor(start) {
        this.Href = start;
    }

    get() {
        return this.Href
    }

    set(href) {
        this.Href = href
    }
}

// const useAPI = (props) => {
//     const [ Data , SetURL ] = useState(null)
//     const [ Error , SetError] = useState(null)

//     useEffect( async ()=>{

//         const Request = (props.type == "post") ? 
//                         {
//                             method: 'post',
//                             headers: {
//                                 'content-type': 'application/json'
//                             },
//                             body: JSON.stringify(props.data)
//                         } : 
//                         (props.type == "get") ?
//                         {
//                             headers: {
//                                 'content-type': 'application/json'
//                             },
//                         } : {}

//         const Api = await fetch(props.url, )
//     })
// }

export {MapsJSX , DayJSX , TimeJSX , ClosePopUp , useLiff , Camera , ResizeImg , Loading , ExportExcel , ExportPDF , ButtonMenu , ReportAction , PopupDom , LoadOtherDom , TabLoad , HrefData}