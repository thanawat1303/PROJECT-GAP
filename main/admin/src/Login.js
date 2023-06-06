import React, { useEffect, useRef, useState } from "react";
import {clientMo}  from "../../../src/assets/js/moduleClient";
import './assets/style/Login.scss'

import Admin from "./Admin";

const Login = ({setMain , state = false}) => {
// this.props.main == Main app
    // const [body , setBody] = useState(<></>)
    const Body = useRef()
    const IconUser = useRef()
    const IconPw = useRef()

    useEffect(()=>{
        if(state) window.history.pushState({} , null , '/admin')
        
        // Body.current.style.backgroundImage = ""
        if(navigator.platform === "Win32") {
            Body.current.setAttribute("computer" , "")
        } else {
            Body.current.setAttribute("mobile" , "")
        }
    })

    const submitFrom = (e) => {
        if(e.target[0].value != '' && e.target[1].value != ''){
            clientMo.rmAction('#loading' , 'hide' , 0)
            const formData = {
                username : e.target[0].value,
                password : e.target[1].value
            }

            setTimeout(()=>{
                clientMo.post('/api/admin/auth' , formData).then((context)=>{
                    if(context) {
                        this.props.main.setState({
                            body : <Admin main={this.props.main}/>
                        })
                        
                    } else {
                        document.querySelector('.error-login').classList.remove('hide')
                        for(let x = 0; x < e.target.length-1; x++) {
                            e.target[x].value = ''
                        }
                    }
                    clientMo.addAction('#loading' , 'hide' , 1500)
                })
            } , 1500)
        } else {
            for(let x = 0; x < e.target.length-1; x++) {
                (e.target[x].value == "") ? e.target[x].classList.add('empty') : e.target[x].classList.remove('empty');
            }
        }
        e.preventDefault()
    }

    return (
        <div ref={Body} className="login-admin">
            <form autoComplete="off" onSubmit={submitFrom}>
                <div className="Logo-App">
                    <img src="/logo2.png"></img>
                    <span>ADMIN</span>
                </div>
                <label className="content-user">
                    <span ref={IconUser}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/>
                        </svg>
                    </span>
                    <input autoComplete="off" type="text" name="username" placeholder="ชื่อผู้ใช้"/>
                </label>
                <label className="content-pw">
                    <span ref={IconPw}></span>
                    <input autoComplete="off" type="password" name="password" placeholder="รหัสผ่าน"/>
                </label>
                <button type="submit" className="bt-submit-form">เข้าสู่ระบบ</button>
            </form>
            {/* <p className="error-login hide">Login Failed Please log in again.</p> */}
        </div>
    )
}

export default Login