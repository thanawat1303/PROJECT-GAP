import React , {Component} from "react";

export default class List extends Component {

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , 'list' )
        else if(this.props.status == 1) window.history.pushState({}, null , 'list')
    }

    render() {
        return (
            <div>
                list
            </div>
        )
    }
}