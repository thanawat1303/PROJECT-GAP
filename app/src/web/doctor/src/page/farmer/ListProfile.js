import React, { useEffect, useState } from "react";
import { DayJSX, TimeJSX } from "../../../../../assets/js/module";

const ListProfile = ({data , status , showPopup}) => {
    // const [base64String , setbase64String] = useState(String.fromCharCode(...data.img.data))
    // const [Date_comfirm , setDate_comfirm] = useState(data.date_doctor_confirm ? new Date(data.date_doctor_confirm) : "")
    // useEffect(()=>{
    //     setbase64String(String.fromCharCode(...data.img.data))
    //     setDate_comfirm(data.date_doctor_confirm ? new Date(data.date_doctor_confirm) : "")
    // } , [data])
    return (
        <>
            <div className="img">
                <img src={data.img}></img>
            </div>
            <div className="detail">
                <div className="text fullname">
                    <input readOnly value={data.fullname}></input>
                </div>
                {
                    status.status === "ap" ? 
                    <div className="flex">
                        <span>ตรวจสอบโดย</span>
                        <div>{data.name_doctor}</div> 
                    </div>
                    : <></>
                }
                {
                    status.status === "ap" ?
                    <div className="flex">
                        <span>วันที่อนุมัติ</span>
                        <DayJSX DATE={
                            // new Date(Date_comfirm.setHours(Date_comfirm.getHours() + 7))
                            data.date_doctor_confirm
                            } TYPE="small"/>
                    </div>
                    :
                    <div className="text date">
                        <DayJSX DATE={data.date_register} TYPE="normal"/>
                        <TimeJSX DATE={data.date_register} MAX={false}/>
                    </div>
                }
            </div>
            <div className="bt">
                <button onClick={()=>showPopup(data.id_table , data.link_user)}>{status.status === "ap" ? "ดูข้อมูล" : "ตรวจสอบ"}</button>
            </div>
            { data.is_msg ?
                <div className="count-msg">
                    <svg viewBox="0 0 48 48">
                        <path d="M 23.007812 5 C 20.430604 5 17.955216 5.3826911 15.664062 6.0859375 A 1.50015 1.50015 0 1 0 16.544922 8.953125 C 18.547769 8.3383714 20.727023 8 23.007812 8 C 33.10213 8 41.005859 14.567511 41.005859 22.236328 C 41.005859 25.967632 39.339349 29.098942 36.613281 31.976562 A 1.50015 1.50015 0 1 0 38.791016 34.039062 C 41.856948 30.802683 44.005859 26.879024 44.005859 22.236328 C 44.005859 12.551146 34.415497 5 23.007812 5 z M 7.2363281 11.515625 A 1.50015 1.50015 0 0 0 6.0820312 12.03125 C 3.5472914 14.857327 2.0058594 18.403085 2.0058594 22.236328 C 2.0058594 30.874232 9.6073525 37.884555 19.505859 39.232422 C 19.733605 39.281857 19.977406 39.361175 20.132812 39.429688 C 20.118043 39.515147 20.153199 39.911316 20.105469 40.273438 C 20.105469 40.273438 20.105469 40.275391 20.105469 40.275391 C 20.092619 40.352451 19.881057 41.615404 19.835938 41.878906 L 19.837891 41.876953 C 19.762771 42.309977 19.521995 43.033546 20.193359 44.048828 C 20.529042 44.556469 21.285396 44.987587 21.962891 45 C 22.640385 45.01241 23.208997 44.789728 23.832031 44.447266 C 26.686076 42.87719 29.695889 41.176108 32.503906 39.255859 A 1.50015 1.50015 0 1 0 30.810547 36.779297 C 28.322739 38.480572 25.598464 40.016715 22.943359 41.484375 C 22.999979 41.145402 23.072266 40.71875 23.072266 40.71875 A 1.50015 1.50015 0 0 0 23.080078 40.671875 C 23.155098 40.109193 23.364983 39.264995 22.923828 38.162109 A 1.50015 1.50015 0 0 0 22.921875 38.158203 C 22.588283 37.333404 21.970623 36.974887 21.476562 36.738281 C 20.982502 36.501675 20.514934 36.37997 20.126953 36.296875 A 1.50015 1.50015 0 0 0 20.007812 36.277344 C 11.219455 35.120988 5.0058594 29.123568 5.0058594 22.236328 C 5.0058594 19.201571 6.2051462 16.387126 8.3164062 14.033203 A 1.50015 1.50015 0 0 0 7.2363281 11.515625 z M 18.333984 17.136719 C 17.769984 17.136719 17.310547 17.592344 17.310547 18.152344 L 17.310547 25.845703 C 17.310547 26.406703 17.768984 26.861328 18.333984 26.861328 C 18.897984 26.861328 19.357422 26.405703 19.357422 25.845703 L 19.357422 18.152344 C 19.357422 17.592344 18.898984 17.136719 18.333984 17.136719 z M 21.853516 17.136719 C 21.743516 17.136719 21.633344 17.154453 21.527344 17.189453 C 21.109344 17.328453 20.828125 17.715344 20.828125 18.152344 L 20.828125 25.845703 C 20.828125 26.406703 21.288516 26.861328 21.853516 26.861328 C 22.419516 26.861328 22.878906 26.405703 22.878906 25.845703 L 22.878906 21.087891 L 26.853516 26.455078 C 27.045516 26.709078 27.351875 26.861328 27.671875 26.861328 C 27.780875 26.861328 27.890094 26.843594 27.996094 26.808594 C 28.416094 26.671594 28.697266 26.284703 28.697266 25.845703 L 28.697266 18.150391 C 28.697266 17.590391 28.238828 17.136719 27.673828 17.136719 C 27.108828 17.136719 26.648438 17.590391 26.648438 18.150391 L 26.648438 22.912109 L 22.671875 17.542969 C 22.479875 17.288969 22.172516 17.136719 21.853516 17.136719 z M 11.466797 17.138672 C 10.902797 17.138672 10.443359 17.592344 10.443359 18.152344 L 10.443359 25.847656 C 10.443359 26.408656 10.901797 26.863281 11.466797 26.863281 L 15.345703 26.863281 C 15.910703 26.863281 16.368187 26.405703 16.367188 25.845703 C 16.367188 25.285703 15.910703 24.830078 15.345703 24.830078 L 12.488281 24.830078 L 12.488281 18.152344 C 12.488281 17.592344 12.031797 17.138672 11.466797 17.138672 z M 31.095703 17.138672 C 30.531703 17.138672 30.072266 17.594297 30.072266 18.154297 L 30.072266 18.15625 L 30.072266 21.998047 L 30.072266 22 L 30.072266 22.001953 L 30.072266 25.845703 C 30.072266 26.406703 30.532703 26.861328 31.095703 26.861328 L 34.974609 26.861328 C 35.539609 26.861328 36 26.405703 36 25.845703 C 36 25.285703 35.539609 24.830078 34.974609 24.830078 L 32.119141 24.830078 L 32.119141 23.013672 L 34.974609 23.013672 C 35.540609 23.013672 36 22.558047 36 21.998047 C 36 21.437047 35.539609 20.982422 34.974609 20.982422 L 34.974609 20.986328 L 32.119141 20.986328 L 32.119141 19.169922 L 34.974609 19.169922 C 35.540609 19.169922 36 18.714297 36 18.154297 C 36 17.594297 35.539609 17.138672 34.974609 17.138672 L 31.095703 17.138672 z"/>
                    </svg>
                </div>
                : <></>
            }
        </>
    )
}

export default ListProfile