import {Document,Page,Text,View,StyleSheet,PDFViewer,PDFDownloadLink} from "@react-pdf/renderer";
import {jsPDF} from 'jspdf'
import { useLiff } from "./module";
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
        
        let splite = Row.filter(val=>val.name.indexOf("|") >= 0)
        const numLine = new Array
        let countHeight = 1
        const maxText = 3
        if(splite.length != 0) {
            const list = splite[0].name.split("|")
            for( let x = 0 ; x < list.length ; x += maxText ){
                const newArray = list.slice(x , x + maxText)
                numLine.push(newArray.join(""))
            }
            countHeight = numLine.length
        }

        for(let Body of Row) {
            const widthText = pdf.getStringUnitWidth(Body.name) * FontSize
            const lineHeight = pdf.getTextDimensions(Body.name, ObjectText).h;
            const endX = startBodyX + parseInt(Body.size)
            const endY = startBodyY + heightBody * (countHeight)
    
            pdf.line(startBodyX , startBodyY , endX , startBodyY) //line ขอบบน
            pdf.line(startBodyX , endY , endX , endY) //line ขอบล่าง
            pdf.line(startBodyX , startBodyY , startBodyX , endY) //line แบ่งช่องแนวตั้ง

            if(Body.name.indexOf("|") >= 0 && countHeight > 1) {
                const newSplit = new Array
                const list = Body.name.split("|")
                for( let x = 0 ; x < list.length ; x += maxText ){
                    const newArray = list.slice(x , x + maxText)
                    newSplit.push(newArray.join(""))
                }
                
                const Text = newSplit.join("\n")
                // console.log(Text)
                pdf.text(Text , startBodyX + 5 , startBodyY + 12)
            }

            else pdf.text(Body.name.replaceAll("|" , "") , startBodyX + ((endX - startBodyX) / 2) - widthText / 2 , startBodyY + ((endY - startBodyY) / 2) + (lineHeight / 3.5))
            
            startBodyX += parseInt(Body.size)
        }
        pdf.line(startBodyX , startBodyY , startBodyX , startBodyY + heightBody * (countHeight))
        startBodyY += heightBody * (countHeight)
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
            TextBoxDot(pdf , pdf.getStringUnitWidth(newTextRow[x] ? newTextRow[x].join("") : "ไม่ระบุ") * fontSizeBody / 3.2 , startRowFirst + 6 , startRow , "")
        }
        else {
            const startRowFirst = startColumn //50
            pdf.setFontSize(16)
            pdf.text( newTextRow[x] ? newTextRow[x].join("") : "" , startRowFirst , startRow - 1);
            pdf.setFontSize(16)
            TextBoxDot(pdf , pdf.getStringUnitWidth(newTextRow[x] ? newTextRow[x].join("") : "ไม่ระบุ") * fontSizeBody / 3.2 , startRowFirst , startRow , "")
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
        // console.log(Export)
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
        TextBoxHead(pdf , 50 , 190 , 'รูปแบบการปลูก')
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
            for(let index in Export.report.slice(0 , 2)) {
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

    const [init , liff] = useLiff("1661049098-dorebKYg")
    init.then( async ()=> {
        if(!liff.isInClient())
            pdf.save(`${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
        else alert("กรุณาดาวโหลดผ่านเบราเซอร์")
    }).catch(err=>{
        pdf.save(`${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
    })
    // const [init , liff] = useLiff("1661049098-dorebKYg")
    // init.then( async ()=>{
    //     if(liff.isInClient()) {
    //         if(liff.isLoggedIn()) {
    //             const profile = await liff.getProfile()
    //             if(profile.userId) {
    //                 const DataPdf = pdf.output("datauristring")

    //                 liff.sendMessages([{
    //                     'type': 'image',
    //                     'originalContentUrl': DataPdf,
    //                     'previewImageUrl': DataPdf
    //                 }]).then(function () {
    //                     // ส่งข้อความไปยัง LINE
    //                 }).catch(function (error) {
    //                     // จัดการข้อผิดพลาด
    //                 });
    //             }
    //         } 
    //         else {
    //             pdf.save(`${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
    //         }
    //     } else {
    //         pdf.save(`${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
    //     }
    // }).catch(err=>{
    //     pdf.save(`${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
    // })
    // window.open(pdf.output('dataurlnewwindow' , "แบบบันทึกข้อมูล"))
    
    // const DataOut = pdf.output("datauristring" , `${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.pdf`)
}

import * as FileSaver from "file-saver"
import XLSX from "sheetjs-style"

const Mount = ["" , "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
const ExportExcel = async (excelData = new Array) => {
    const filetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = ".xlsx"

    const nameSpace = new Set(excelData.map(val=>val.dataForm.name_plant))
    const DataWs = excelData.map((val , key)=>{

        const DatePlant = val.dataForm.date_plant.split(" ")[0].split("-")
        const DateSuccess = val.dataForm.date_success ? val.dataForm.date_success.split(" ")[0].split("-") : "";
        const DataExport = {
            "plant" : val.dataForm.name_plant,
            "ชื่อเกษตรกร" : val.farmer[0].fullname.toString().trim(),
            "รหัสเกษตรกร" : val.farmer[0].id_farmer.toString().trim(),
            "วันที่เริ่มปลูก" : `${DatePlant[2]}-${Mount[parseInt(DatePlant[1])]}-${(parseInt(DatePlant[0]) + 543).toString().slice(2)}`,
            "วันที่ส่งผลผลิต" : DateSuccess ? `${DateSuccess[2]}-${Mount[parseInt(DateSuccess[1])]}-${(parseInt(DateSuccess[0]) + 543).toString().slice(2)}` : "ยังไม่ทำการเก็บเกี่ยว",
            "จำนวนต้น" : val.dataForm.qty,
        }
        
        if(val.chemi.length != 0) {
            DataExport["สารเคมี"] = "|"
            for (let indexChemi in val.chemi) {
                const DateUse = val.chemi[indexChemi].date.split(" ")[0].split("-")
                DataExport[`วันเดือนปี ${parseInt(indexChemi) + 1}`] = `${DateUse[2]}-${Mount[parseInt(DateUse[1])]}-${(parseInt(DateUse[0]) + 543).toString().slice(2)}`
                DataExport[`โรคที่พบ ${parseInt(indexChemi) + 1}`] = val.chemi[indexChemi].insect
                DataExport[`การป้องกัน ${parseInt(indexChemi) + 1}`] = `กำจัด${val.chemi[indexChemi].insect}`
                DataExport[`สารเคมี ${parseInt(indexChemi) + 1}`] = val.chemi[indexChemi].formula_name
                DataExport[`วิธีการใช้ ${parseInt(indexChemi) + 1}`] = val.chemi[indexChemi].use_is
                DataExport[`อัตราผสม ${parseInt(indexChemi) + 1} (cc/L)`] = val.chemi[indexChemi].rate
                DataExport[`ปริมาณที่ใช้ ${parseInt(indexChemi) + 1} (cc)`] = val.chemi[indexChemi].volume
            }
        }

        if(val.ferti.length != 0) {
            DataExport["ปัจจัยการผลิต"] = "|"
            for (let indexFerti in val.ferti) {
                const DateUse = val.ferti[indexFerti].date.split(" ")[0].split("-")
                DataExport[`วดป. ${parseInt(indexFerti) + 1}`] = `${DateUse[2]}-${Mount[parseInt(DateUse[1])]}-${(parseInt(DateUse[0]) + 543).toString().slice(2)}`
                DataExport[`ปัจจัย ${parseInt(indexFerti) + 1}`] = val.ferti[indexFerti].name
                DataExport[`สูตร ${parseInt(indexFerti) + 1}`] = val.ferti[indexFerti].formula_name
                DataExport[`วิธีใช้ ${parseInt(indexFerti) + 1}`] = val.ferti[indexFerti].use_is
                DataExport[`ปริมาณ ${parseInt(indexFerti) + 1}`] = val.ferti[indexFerti].volume
            }
        }

        return DataExport
    })

    const DataSheets = {}
    nameSpace.forEach((name)=>{
        const DataInWs = DataWs.filter(val=>val.plant == name).map((val , key)=>{
            delete val.plant
            return {"ลำดับที่" : key + 1 , ...val}
        })
        const ws = XLSX.utils.json_to_sheet(DataInWs)
        let stateColume = ""
        for(let x of Object.entries(ws)) {
            if(x[0][x[0].length - 1] == 1 && isNaN(x[0][x[0].length - 2])) {
                if (ws[x[0]].v == "ลำดับที่") stateColume = "";
                else if(ws[x[0]].v == "สารเคมี") stateColume = "c";
                else if (ws[x[0]].v == "ปัจจัยการผลิต") stateColume = "f";

                const colorFill = stateColume == "" ? {
                    bgColor : { rgb : "81f6e0" },
                    fgColor : { rgb : "81f6e0" }
                } : stateColume == "c" ? {
                    bgColor : { rgb : "FFFF00" },
                    fgColor : { rgb : "FFFF00" }
                } : stateColume == "f" ? {
                    bgColor : { rgb : "1DFF83" },
                    fgColor : { rgb : "1DFF83" }
                } : {}

                ws[x[0]].s = { 
                    font: { 
                        bold: true , 
                        name : "TH SarabunPSK"
                    } ,
                    alignment : {
                        vertical : "center",
                        horizontal : "center",
                        wrapText: false
                    } ,
                    fill : colorFill
                }
            } else if (x[0] != "!ref") {
                ws[x[0]].s = { 
                    font: { 
                        name : "TH SarabunPSK"
                    } ,
                    alignment : {
                        vertical : "center",
                        horizontal : "center",
                        wrapText: false
                    }
                }
            }
        }
        DataSheets[name] = ws
    })

    const wb = {Sheets : DataSheets , SheetNames : [...nameSpace]}
    const excelBuffer = XLSX.write(wb , {bookType : "xlsx" , type : "array"})
    
    const data = new Blob([excelBuffer] , {type : filetype})
    FileSaver.saveAs(data , new Date().toLocaleString().split(" ")[0] , fileExtension)
}

export {ExportPDF , ExportExcel}