import React, { useEffect, useState } from "react";
import {clientMo}  from "../../src/assets/js/moduleClient";
import {useLiff} from "../../src/assets/js/module";

import {NonLine} from "./nonLine";
import {SignUp} from "./Signup";

// import Login from "./Login";
// import Doctor from "./Doctor";

// import './assets/style/main.scss'

const MainFarmer = (props) => {
    const [body , setBody] = useState(<></>)
    const [init , liff] = useLiff("1661049098-A9PON7LB")

    useEffect(()=>{
        init.then(()=>{
            if(liff.isInClient()) {
                if(liff.isLoggedIn()) {
                    liff.getProfile().then((profile)=>{
                        // สมัครเข้าต้องค้นหาบัญชีโดยไม่ตรง status ยกเลิกบัญชี
                        if(profile.userId) {
                            // clientMo.post("/api/farmer/check" , {profile:profile})
                            clientMo.post("/api/farmer/sign" , {uid:profile.userId}).then((result)=>{
                                if(result === "no") setBody(<SignUp profile={profile} liff={liff}/>)
                                else if (result === "search") {
                                    setBody(<>บัญชีลงทะเบียนแล้ว</>)
                                }
                                else if (result === "error auth") setBody(<>auth error</>)
                            })
                        }
                    })
                } else {
                    liff.login()
                }
            } else {
                clientMo.post("/api/farmer/sign" , {uid:"TEST"}).then((result)=>{
                    if(result === "no") setBody(<SignUp />)
                    else if (result === "search") setBody(<>บัญชีลงทะเบียนแล้ว</>)
                    else if (result === "error auth") setBody(<>auth error</>)
                })
                // setBody(<NonLine />)
            }
            clientMo.addAction('#loading' , 'hide' , 1000)
        }).catch(err=>{
            console.log(err)
        })
    } , [])

    return(
        body
    )
}

export {MainFarmer}
// export default class MainFaemer extends Component {
//     constructor(){
//         super();
//         this.state={
//             body : <div></div>
//         }
//     }

//     componentDidMount() {

//         clientMo.post('/api/doctor/check').then((context)=>{
//             console.log(context)
//             // if(context) 
//             //     this.setState({
//             //         body : <Doctor main={this} socket={this.props.socket}/>
//             //     })
//             // else 
//             //     this.setState({
//             //         body : <Login socket={this.props.socket} main={this}/>
//             //     }) 
            
//             clientMo.addAction('#loading' , 'hide' , 1000)
//         })
        
//     }

//     render() {
//         return (
//             this.state.body
//         )
//     }
// }