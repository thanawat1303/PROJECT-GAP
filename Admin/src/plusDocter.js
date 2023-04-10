import React , {Component} from "react";

export default class Plus extends Component {

    componentDidMount(){
        if (this.props.status == 0) window.history.replaceState({} , null , 'plus')
        else if(this.props.status == 1) window.history.pushState({}, null , 'plus')
    }

    render() {
        return (
            <form>
                
            </form>
        )
    }
}