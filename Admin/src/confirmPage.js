import React , {Component} from "react";

export default class Confirm extends Component {
    componentDidMount(){
        if (this.props.status) window.history.pushState({}, null , 'plus/confirm')
        else window.history.replaceState({} , null , 'plus/confirm')
    }

    render(){
        return(
            <div>
                Confirm
            </div>
        )
    }
}