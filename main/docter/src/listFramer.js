import React , {Component} from "react";
import { clientMo } from "../../../src/assets/js/moduleClient";

export default class List extends Component {

    constructor(){
        super();
        this.state={
            body : <></>,
            delete : <></>,
            textDetail : <></>
            // list : []
        }
    }

    componentDidMount() {
        if (this.props.status == 0) window.history.replaceState({} , null , '/docter/list')
        else if(this.props.status == 1) window.history.pushState({}, null , '/docter/list')
        
        this.setState({
            body : JSON.parse(this.props.list).map((listFm , index) =>
                        <div key={index} className="container-fm">
                            
                        </div>
                    ) // use map is create element object
        })
    
    }

    render() {
        return(<></>)
    }
}