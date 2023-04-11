import React , {Component} from "react";
import './assets/style/Plus.scss'

export default class Plus extends Component {

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , 'plus')
        else if(this.props.status == 1) window.history.pushState({}, null , 'plus')
    }

    render() {
        return (
            <form id="Pform">
                <label id="id" className="textbox-Pform">
                    <span className="label-Pform">รหัสประตัวผู้ส่งเสริม</span>
                    <input placeholder="รหัสประตัวผู้ส่งเสริม"></input>
                </label>
                <label id="password" className="textbox-Pform">
                    <span className="label-Pform">รหัสผ่าน</span>
                    <input placeholder="รหัสผ่าน"></input>
                </label>
                <button>
                    เพิ่มข้อมูล
                </button>
            </form>
        )
    }
}