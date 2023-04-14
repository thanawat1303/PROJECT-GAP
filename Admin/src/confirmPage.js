import React , {Component} from "react";

export default class Confirm extends Component {
    componentDidMount(){
        if (this.props.state == 1) window.history.pushState({}, null , '/plus/confirm')
        else if (this.props.state == 2)window.history.replaceState({} , null , '/plus/confirm')
    }

    render(){
        return(
            <div>
                Confirm
            </div>
        )
    }
}