import React , {Component, useEffect, useRef, useState} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";
import Login from "./Login";

// import NavDoctor from "./navDoctor";
import NavFirst from "./navFirst";

import "./assets/style/doctorMain.scss"
// import './assets/style/doctor.scss'
import DesktopNev from "./navTop/desktop";
import SessionOut from "./sesionOut";
import PageFormPlant from "./page/form/PageFormPlant";
import PageExport from "./page/export/PageExport";
import PageFarmer from "./page/farmer/PageFarmer";
import PageData from "./page/data/PageData";

const Doctor = ({setMain , socket , isClick = 0}) => {
    const [body , setBody] = useState(<div></div>)
    const [session , setSession] = useState(<div></div>)
    const [TextPage , setTextPage] = useState([])

    const [getProfile , setProfile] = useState([])

    const ImageCover = useRef()
    const frameImage = useRef()
    const BodyRef = useRef()

    const [Responsive , setResponsive] = useState(window.innerWidth)
    const [SizeProfileImg , setSizeProfileImg] = useState(0)

    useEffect(()=>{
        if(isClick === 1) window.history.replaceState({} , "" , "/doctor")
        
        FetchProfile()
        ChkPath(null , "web")
        window.addEventListener("popstate" , ChkPath)
        window.addEventListener("resize" , Resize)

        return() => {
            window.removeEventListener("popstate" , ChkPath)
            window.removeEventListener("resize" , Resize)
        }
    } , [])

    const FetchProfile = async () => {
        const result = await clientMo.get("/api/doctor/profile/get")
        if(result) 
            setProfile(JSON.parse(result))
        else setSession()
    }

    const ChkPath = async (e , type="pop") => {
        const context = await clientMo.post('/api/doctor/check')
        if(context) {
            let path = window.location.pathname.split("/").filter(val=>val)
            if(path.length === 1 && path[0] === "doctor") setBody(<NavFirst setMain={setMain} setdoctor={setBody} setSession={sessionoff} socket={socket} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
            else if(path.length >= 2 && path[0] === "doctor") {
                if(path[1] === "form"){
                    // if(path[2] == undefined) setBody(<PageForm setMain={setMain} socket={socket} setBodyDoctor={setBody} session={sessionoff} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    // else if(path[2] === "ap" || path[2] === "wt") {
                    //     if(path[2] === "ap") {
                    //         setBody(<PageFormPlant setMain={setMain} socket={socket} setBodyDoctor={setBody} session={sessionoff} LoadType={`ap:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    //     }
                    //     else if(path[2] === "wt") {
                    //         setBody(<PageFormPlant setMain={setMain} socket={socket} setBodyDoctor={setBody} session={sessionoff} LoadType={`wt:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    //     }
                    // }
                    setBody(<PageFormPlant setMain={setMain} socket={socket} setBodyDoctor={setBody} session={sessionoff} LoadType={`ap:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                } else if(path[1] === "farmer") {
                    if(path[2] === "ap") {
                        setBody(<PageFarmer setMain={setMain} socket={socket} session={sessionoff} LoadType={`ap:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    }
                    else if(path[2] === "wt") {
                        setBody(<PageFarmer setMain={setMain} socket={socket} session={sessionoff} LoadType={`wt:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    }
                    else if(path[2] === "not") {
                        setBody(<PageFarmer setMain={setMain} socket={socket} session={sessionoff} LoadType={`not:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                    }
                } else if(path[1] === "data") {
                    setBody(<PageData setMain={setMain} socket={socket} setBodyDoctor={setBody} session={sessionoff} LoadType={`plant:${type}`} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage}/>)
                }
                
            } else {
                setBody(<div>เกิดปัญหา</div>)
            }
        }
        else sessionoff()
    }

    const sessionoff = (type = false) => {
        if(type) {
            setMain(<Login setMain={setMain} socket={socket} isClick={1}/>)
        } else {
            setSession(<SessionOut/>)
            document.getElementById('session').setAttribute('show' , '')
        }
    } 

    const Resize = () => {
        const size = window.innerWidth
        setResponsive(size)
        if(size <= 800 && frameImage.current) setSizeProfileImg(frameImage.current.clientWidth * 43 / 100)
    }

    const LoadImg = () => {
        setSizeProfileImg(frameImage.current.clientWidth * 43 / 100)
    }

    return (
        <div className="doctor"
        // onMouseDown={this.hidePopUp} onContextMenu={this.hidePopUp}
        >
            <DesktopNev setMain={setMain} socket={socket} setSession={sessionoff} setBody={setBody} eleImageCover={ImageCover} eleBody={BodyRef} setTextStatus={setTextPage} 
                getProfile={getProfile} FetchProfile={FetchProfile}/>
            <section ref={ImageCover} className="image-cover">
                { Responsive > 800 ?
                    <>
                    <div className="text-cover">
                        <div className="icon">
                            <span>ยินดีต้อนรับ</span>
                            <img src="/Logo-white.png"></img>
                        </div>
                        <div className="status">
                            {TextPage.map((val , index)=>(
                                <div className="box-status" key={index}>
                                    <span>{val}</span>
                                    {TextPage.length - 1 > index ? <img src={"/arrow.png"}></img> : <></>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="frame">
                        <img src="/cover-2-3.png"></img>
                    </div>
                    </> :
                    <>
                    <div className="text-icon-cover" ref={frameImage}>
                        <div className="text">
                            <span>ยินดีต้อนรับ</span>
                            <span style={{fontWeight : 900}}>หมอพืช</span>
                        </div>
                        <div className="icon-profile" style={{
                            borderRadius : "50%",
                            overflow : "hidden",
                            width : `${SizeProfileImg}px` ,
                            height : `${SizeProfileImg}px`
                        }} onLoad={LoadImg}>
                            <img src={getProfile.length != 0 ? getProfile.img_doctor ? getProfile.img_doctor : "/PROFILE.png" : "/PROFILE.png"}></img>
                        </div>
                    </div>
                    <div className="frame-image-cover">
                        <img src="/cover-2-3.png"></img>
                    </div>
                    </>
                }
            </section>
            <section ref={BodyRef} className="container-body-doctor">
                {/* <div onLoad={this.checkSize}>
                    {this.state.nav}
                </div> */}
                <bot-main>
                    <bot-content>
                        {body}
                    </bot-content>
                </bot-main>
            </section>
            {/* feedBack */}
            <section id="session">
                {session}
            </section>
        </div>
    )
}

export default Doctor

// constructor(){
    //     super();
    //     this.state={
    //         // nav: <div></div> ,
    //         body: ,
    //         session: ,
    //         // timeOld : 0
    //     }
    // }

    // componentDidMount() {
    //     this.setState({
    //         body : 
    //         // <NavDoctor bodyDoctor={this} main={this.props.main} socket={this.props.socket}/>
    //     })
    //     // window.addEventListener('resize' , this.checkSize)
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('resize' , this.checkSize)
    // }

    // checkSize = () => {
    //     // e.target.innerHeight 
    //     let list = document.querySelectorAll('.nav-menu .list-menu-nav')
    //     // console.log(window.innerWidth)
    //     if(window.innerWidth <= 500) {
    //         list.forEach((el) => {
    //             el.setAttribute('mini-nav' , '')
    //             el.setAttribute('mini-nav-action' , '')
    //         })
    //     } else {
    //         list.forEach((el) => {
    //             el.removeAttribute('mini-nav')
    //             el.removeAttribute('mini-nav-action')
    //         })
    //     }
    // }

    // Logout = (e) => {
    //     e.target.parentElement.classList.toggle('hide')
    //     clientMo.rmAction('#loading' , 'hide' , 0)
    //     setTimeout(()=>{
    //         clientMo.get('/api/logout').then(()=>{
    //             this.props.main.setState({
    //                 body : <Login socket={this.props.socket} main={this.props.main} state={true}/>
    //             })
    //             clientMo.addAction('#loading' , 'hide' , 1500)
    //         })
    //     } , 2000)
    // }

    // Menu = () => {
    //     let list = document.querySelectorAll('.nav-menu .list-menu-nav')
    //     let time = new Date()

    //     if (time.getTime() - this.state.timeOld > 500) {
    //         this.state.timeOld = time.getTime()
    //         list.forEach((el , index) => {
            
    //             if(el.getAttribute('mini-nav') == '') {
    //                 el.removeAttribute('mini-nav')
    //                 setTimeout(()=>{el.removeAttribute('mini-nav-action')}, 300)
    //             }
    //             else {
    //                 el.setAttribute('mini-nav' , '')
    //                 setTimeout(()=>{el.setAttribute('mini-nav-action' , '')}, 300)
    //             }
                
    //         })
            
    //     }
    // }

    // showOption = () => {
    //     document.getElementById('profile-otion').classList.toggle('display')
    //     document.querySelector('.profile-icon').classList.toggle('select')
    // }

    // hidePopUp = (e) => {
    //     if(document.querySelector('#profile-otion.display')) {
    //         let hide = true 
    //         if(e.target == document.querySelector('.profile-icon #icon')) hide = false
    //         if(e.target == document.querySelector('.profile-icon')) hide = false
    //         if(e.target == document.querySelector('#profile-otion')) hide = false            
    //         if(e.target == document.querySelector('#profile-otion #icon')) hide = false            

    //         if(hide) {
    //             document.querySelector('#profile-otion').classList.remove('display')
    //             document.querySelector('.profile-icon').classList.remove('select')
    //         }
    //     }  
    // }